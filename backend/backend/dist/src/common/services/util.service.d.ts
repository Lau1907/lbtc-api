import { JwtService } from "@nestjs/jwt";
export declare class UtilService {
    private readonly jwtSvc;
    constructor(jwtSvc: JwtService);
    hashPassword(password: string): Promise<string>;
    hash(data: string): Promise<string>;
    checkPassword(password: string, encryptedPassword: string): Promise<boolean>;
    generateJWT(payload: any, expiresIn?: any): Promise<string>;
    getPayload(token: string): Promise<any>;
}
