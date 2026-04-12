import { UtilService } from 'src/common/services/util.service';
import { CreateUserDto } from 'src/modules/auth/dto/create-user-dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authSvc;
    private readonly utilSvc;
    constructor(authSvc: AuthService, utilSvc: UtilService);
    private generateTokens;
    register(createUserDto: CreateUserDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    login(loginDto: LoginDto): Promise<any>;
    getProfile(req: any): any;
    refreshToken(req: any): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(req: any): Promise<void>;
}
