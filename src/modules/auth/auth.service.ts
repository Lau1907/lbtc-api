import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {

  constructor(
  private readonly userService: UserService,
  private readonly jwtSvc: JwtService
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
      const payload = await this.jwtSvc.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET
      });

      const newAccessToken = await this.jwtSvc.signAsync({
        sub: payload.sub,
        email: payload.email
      }, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h'
      });

      return {
        access_token: newAccessToken
      };

    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

}