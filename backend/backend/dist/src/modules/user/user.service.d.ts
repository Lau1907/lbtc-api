import { Client } from "pg";
import { PrismaService } from "src/common/services/prisma.service";
import { CreateUserDto } from "src/modules/auth/dto/create-user-dto";
import { UpdateUserDto } from "src/modules/auth/dto/update-user-dto";
import { User } from "src/modules/auth/entities/user.entity";
export declare class UserService {
    private db;
    private prisma;
    constructor(db: Client, prisma: PrismaService);
    getUsers(): Promise<any[]>;
    getUserById(id: number): Promise<any>;
    findByUsername(username: string): Promise<User | null>;
    insertUser(user: CreateUserDto): Promise<User>;
    updateUser(id: number, userUpdated: UpdateUserDto): Promise<User>;
    deleteUser(id: number): Promise<boolean>;
    saveLog(statusCode: number, path: string, error: string, errorcode: string): Promise<void>;
}
