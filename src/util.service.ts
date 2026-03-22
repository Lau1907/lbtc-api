import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from 'bcrypt';

@Injectable()
export class UtilService{
    constructor(private readonly jwtSvc: JwtService){
        }
        public async hashPassword(password: string): Promise<string>{
            return await bcrypt.hash(password, 10);
        }

        public async checkPassword(password: string, encryptedPassword: string): Promise<boolean>{
            return await bcrypt.compare(password, encryptedPassword);
        }

        public async generateJWT(payload: any, expiresIn: any = '60s'): Promise<string>{
            return await this.jwtSvc.signAsync(payload, {secret: process.env.JWT_SECRET, expiresIn: expiresIn });
        }
    }
