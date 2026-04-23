import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { UtilService } from 'src/common/services/util.service';
import { CreateUserDto } from 'src/modules/auth/dto/create-user-dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authSvc: AuthService,
    private readonly utilSvc: UtilService  ) {}

  private async generateTokens(user: { id: number; name: string; lastname: string, role: string }) {
    const basePayload = { sub: user.id, name: user.name, lastName: user.lastname, role: user.role };
    const refresh_token_jwt = await this.utilSvc.generateJWT(basePayload, '7d');
    const hashRT = await this.utilSvc.hash(refresh_token_jwt);
    await this.authSvc.updateHash(user.id, hashRT);

    const access_token = await this.utilSvc.generateJWT({ ...basePayload, hash: hashRT }, '1h');
    return { access_token, refresh_token: refresh_token_jwt };
  }

  @Post('/register')
@HttpCode(HttpStatus.CREATED)
public async register(@Body() createUserDto: CreateUserDto) {
  try {
    const { name, lastname, username, password } = createUserDto;
    const hashedPassword = await this.utilSvc.hashPassword(password);
    const user = await this.authSvc.register(name, lastname, username, hashedPassword);
    return this.generateTokens(user);
  } catch (error) {
    console.error('REGISTER ERROR:', error); // 👈 agrega esto
    throw error;
  }
}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: LoginDto): Promise<any> {
    const { username, password } = loginDto;

    const user = await this.authSvc.getUserByUsername(username);
    if (!user) throw new UnauthorizedException('El usuario y/o contraseña es incorrecto');

    if (!(await this.utilSvc.checkPassword(password!, user.password!)))
      throw new UnauthorizedException('El usuario y/o contraseña son incorrectos');

    return this.generateTokens(user);
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  public getProfile(@Req() req: any) {
    return req['user'];
  }

  @Post('/refresh')
  @UseGuards(AuthGuard)
  public async refreshToken(@Req() req: any) {
    const sessionUser = req['user'];
    const token = req.headers.authorization?.split(' ')[1]; // 👈 token crudo

    const user = await this.authSvc.getUserById(sessionUser.sub);
    if (!user || !user.hash) throw new ForbiddenException('Acceso denegado');

    const isValid = await this.utilSvc.checkPassword(token, user.hash); // 👈 bcrypt.compare
    if (!isValid) throw new ForbiddenException('Token inválido');

    return this.generateTokens(user);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  public async logout(@Req() req: any) {
    await this.authSvc.updateHash(req['user'].sub, null);
  }
}