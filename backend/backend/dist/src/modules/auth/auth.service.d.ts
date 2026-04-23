import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/common/services/prisma.service';
import { UserService } from '../user/user.service';
export declare class AuthService {
    private readonly userService;
    private readonly jwtSvc;
    private readonly prisma;
    constructor(userService: UserService, jwtSvc: JwtService, prisma: PrismaService);
    login(username: string, password: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refreshToken(token: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    updateHash(userId: number, hash: string | null): Promise<User>;
    getUserById(id: number): Promise<User | null>;
    getUserByUsername(username: string): Promise<User | null>;
    register(name: string, lastname: string, username: string, hashedPassword: string, role: string): Promise<User>;
    saveLog(statusCode: number, path: string, error: string, errorcode: string): Promise<void>;
}
