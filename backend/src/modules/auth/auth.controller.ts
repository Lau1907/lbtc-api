import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { UtilService } from 'src/common/services/util.service';
import { CreateUserDto } from 'src/modules/auth/dto/create-user-dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authSvc: AuthService,
    private readonly utilSvc: UtilService
  ) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  public async register(@Body() createUserDto: CreateUserDto) {
    const { name, lastname, username, password, role } = createUserDto;
    const hashedPassword = await this.utilSvc.hashPassword(password!);
    
    // NestJS enviará automáticamente el error 401 si el usuario ya existe
    return await this.authSvc.register(
      name!, 
      lastname!, 
      username!, 
      hashedPassword, 
      role ?? 'user'
    );
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: LoginDto): Promise<any> {
    const { username, password } = loginDto;
    const user = await this.authSvc.getUserByUsername(username);

    if (!user || !(await this.utilSvc.checkPassword(password!, user.password!))) {
      throw new UnauthorizedException('El usuario y/o contraseña son incorrectos');
    }

    await this.authSvc.saveLog(200, '/api/auth/login', `Login exitoso: ${username}`, 'LOGIN_SUCCESS');
    return this.authSvc.login(username, password!);
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  public getProfile(@Req() req: any) {
    return req['user'];
  }

  @Post('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  public async logout(@Req() req: any) {
    await this.authSvc.updateHash(req['user'].sub, null);
  }
}