import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class AuthService {

    constructor(private readonly prisma:PrismaService){ }

    public async getUserByUsername(username: AuthDto): Promise<User | null>{
        return await this.prisma.user.findFirst({
            where: { username }
        });
    }
    public logIn (){
        return "Sesion exitosa";
    }
}