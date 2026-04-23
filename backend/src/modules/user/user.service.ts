import { Inject, Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { Client } from "pg";
import { PrismaService } from "src/common/services/prisma.service";
import { CreateUserDto } from "src/modules/auth/dto/create-user-dto";
import { UpdateUserDto } from "src/modules/auth/dto/update-user-dto";
import { User } from "src/modules/auth/entities/user.entity";

@Injectable()
export class UserService {

    constructor(
        @Inject('DATABASE_CONNECTION') private db: Client,
        private prisma: PrismaService
    ) {}

// Obtiene todos los usuarios sin exponer datos sensibles
    public async getUsers(): Promise<any[]> {
  return await this.prisma.user.findMany({
    select: {
      id: true,
      name: true,
      lastname: true,
      username: true,
      role: true,
      created_at: true
    }
  });
}

public async getUserById(id: number): Promise<any> {
  const user = await this.prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      lastname: true,
      username: true,
      role: true,
      created_at: true
    }
  });

  if (!user) throw new Error(`User with id ${id} not found`);
  return user;
}

// Busca un usuario por su nombre de usuario para autenticación
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

        return (result.rowCount ?? 0) > 0;
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

//correccion del refresh 
//logout