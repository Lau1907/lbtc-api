import {
    Body,
    Controller,
    Get,
    Headers,
    Post,
    UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('api/auth')
export class AuthController {

  constructor(private readonly authSvc: AuthService) {}

  @Post('login')
async login(@Body() body: any) {
  const { username, password } = body;
  return this.authSvc.login(username, password);
}

  @Post('refresh')
  async refresh(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.authSvc.refreshToken(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Headers() headers) {
    return {
      message: 'Ruta protegida',
      user: headers.user
    };
  }

  @Post('logout')
  logout() {
    return {
      message: 'Logout exitoso (manejado en frontend)'
    };
  }
}