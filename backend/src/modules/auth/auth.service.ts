import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  const user = await this.userService.findByUsername(username);

  if (!user) {
    throw new UnauthorizedException('Usuario no existe');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new UnauthorizedException('Contraseña incorrecta');
  }

  const payload = {
    sub: user.id,
    username: user.username
  };

  const access_token = await this.jwtSvc.signAsync(payload, {
    secret: process.env.JWT_SECRET!,
    expiresIn: '1h'
  });

  const refresh_token = await this.jwtSvc.signAsync(payload, {
    secret: process.env.JWT_REFRESH_SECRET!,
    expiresIn: '7d'
  });

  return {
    access_token,
    refresh_token
  };
}

  async refreshToken(token: string) {
    try {
      // 1. Verificar refresh token
      const payload = await this.jwtSvc.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET
      });

      // 2. Buscar usuario en BD
      const user = await this.userService.getUserById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('Usuario no válido');
      }

      // 3. Crear nuevo payload
      const newPayload = {
        sub: user.id,
        username: user.username
      };

      // 4. Generar nuevos tokens
      const access_token = await this.jwtSvc.signAsync(newPayload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h'
      });

      const refresh_token = await this.jwtSvc.signAsync(newPayload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d'
      });

      // 5. Retornar ambos tokens
      return {
        access_token,
        refresh_token
      };

    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  public async updateHash(userId: number, hash: string | null): Promise<User> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { hash },
    });
  }

  public async getUserById(id: number): Promise<User | null> {
    return await this.prisma.user.findFirst({ where: { id } });
  }

  public async getUserByUsername(username: string): Promise<User | null> {
    return await this.prisma.user.findFirst({ where: { username } });
  }

  async register(name: string, lastname: string, username: string, hashedPassword: string, role: string): Promise<User> {
    return await this.prisma.user.create({
      data: { name, lastname, username, password: hashedPassword, role },
    });
  }

  // Guarda un log de evento en la base de datos
public async saveLog(statusCode: number, path: string, error: string, errorcode: string): Promise<void> {
  await this.prisma.logs.create({
    data: {
      statusCode,
      timeStamp: new Date(),
      path,
      error,
      errorcode
    }
  }).catch(err => console.error('Error al guardar log:', err));
}
}