import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/common/services/prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtSvc: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.getUserByUsername(username);
    if (!user) throw new UnauthorizedException('El usuario y/o contraseña son incorrectos');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('El usuario y/o contraseña son incorrectos');

    return this.generateTokens(user);
  }

  async register(name: string, lastname: string, username: string, hashedPassword: string, role: string = 'user') {
    // 1. Validar si el usuario ya existe
    const existingUser = await this.prisma.user.findFirst({ where: { username } });
    
    if (existingUser) {
      // Lanzamos 409 para que el interceptor de Angular no redirija a login
      throw new ConflictException('El nombre de usuario ya está en uso');
    }

    // 2. Buscar el ID del rol
    const roleRecord = await this.prisma.role.findFirst({ where: { name: role } });
    const roleId = roleRecord?.id ?? 1;

    // 3. Crear el usuario
    const newUser = await this.prisma.user.create({
      data: { name, lastname, username, password: hashedPassword, role_id: roleId },
      include: { role: true }
    });

    return this.generateTokens(newUser);
  }

  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      username: user.username,
      name: user.name,
      lastname: user.lastname,
      role: user.role?.name 
    };

    const access_token = await this.jwtSvc.signAsync(payload, {
      secret: process.env.JWT_SECRET!,
      expiresIn: '1h',
    });

    const refresh_token = await this.jwtSvc.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET!,
      expiresIn: '7d',
    });

    return { access_token, refresh_token };
  }

  public async getUserByUsername(username: string): Promise<any> {
    return await this.prisma.user.findFirst({
      where: { username },
      include: { role: true },
    });
  }

  public async getUserById(id: number): Promise<any> {
    return await this.prisma.user.findFirst({
      where: { id },
      include: { role: true },
    });
  }

  public async saveLog(statusCode: number, path: string, error: string, errorcode: string): Promise<void> {
    await this.prisma.logs.create({
      data: { statusCode, timeStamp: new Date(), path, error, errorcode },
    }).catch((err) => console.error('Error al guardar log:', err));
  }
  
  public async updateHash(userId: number, hash: string | null): Promise<User> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { hash },
    });
  }
}