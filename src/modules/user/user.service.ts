import { Inject, Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { Client } from "pg";
import { CreateUserDto } from "src/modules/auth/dto/create-user-dto";
import { UpdateUserDto } from "src/modules/auth/dto/update-user-dto";
import { User } from "src/modules/auth/entities/user.entity";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UserService {

    constructor(
        @Inject('DATABASE_CONNECTION') private db: Client,
        private prisma: PrismaService
    ) {}

    // 📋 Obtener usuarios
    public async getUsers(): Promise<User[]> {
        return await this.prisma.user.findMany();
    }

    // 🔍 Obtener usuario por ID
    public async getUserById(id: number): Promise<User> {

        const user = await this.prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }

        return user;
    }

    // 🔍 Buscar por username (CLAVE PARA LOGIN)
    public async findByUsername(username: string): Promise<User | null> {
        return await this.prisma.user.findFirst({
            where: { username }
        });
    }

    // ➕ Crear usuario
    public async insertUser(user: CreateUserDto): Promise<User> {

        const hashedPassword = await bcrypt.hash(user.password, 10);

        const query = `
        INSERT INTO "User" (name, lastname, username, password)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `;

        const result = await this.db.query(query, [
            user.name,
            user.lastname,
            user.username,
            hashedPassword
        ]);

        return result.rows[0];
    }

    // ✏️ Actualizar usuario
    public async updateUser(
        id: number,
        userUpdated: UpdateUserDto
    ): Promise<User> {

        const user = await this.getUserById(id);

        const hashedPassword = userUpdated.password
            ? await bcrypt.hash(userUpdated.password, 10)
            : user.password;

        const query = `
        UPDATE "User"
        SET
            name=$1,
            lastname=$2,
            username=$3,
            password=$4
        WHERE id=$5
        RETURNING *
        `;

        const result = await this.db.query(query, [
            userUpdated.name ?? user.name,
            userUpdated.lastname ?? user.lastname,
            userUpdated.username ?? user.username,
            hashedPassword,
            id
        ]);

        return result.rows[0];
    }

    // 🗑️ Eliminar usuario
    public async deleteUser(id: number): Promise<boolean> {

        await this.getUserById(id);

        const sql = `DELETE FROM "User" WHERE id=$1`;

        const result = await this.db.query(sql, [id]);

        return result.rowCount > 0;
    }
}