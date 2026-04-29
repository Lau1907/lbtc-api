import { Inject, Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { Client } from "pg";
import { PrismaService } from "src/common/services/prisma.service";
import { CreateUserDto } from "src/modules/auth/dto/create-user-dto";

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
      role_id: true,
      role: { select: { name: true } }, 
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
      password: true,
      role_id: true,
      role: { select: { name: true } },
      created_at: true
    }
  });
  if (!user) throw new Error(`User with id ${id} not found`);
  return user;
}

public async findByUsername(username: string): Promise<any> {
  return await this.prisma.user.findFirst({
    where: { username },
    include: { role: true }
  });
}

    // Crear usuario
public async insertUser(user: CreateUserDto): Promise<any> {
  const hashedPassword = await bcrypt.hash(user.password!, 10);
  
  // Buscar el id del rol
  const roleRecord = await this.prisma.role.findFirst({ 
    where: { name: user.role ?? 'user' } 
  });
  const roleId = roleRecord?.id ?? 1;

  return await this.prisma.user.create({
    data: {
      name: user.name!,
      lastname: user.lastname!,
      username: user.username!,
      password: hashedPassword,
      role_id: roleId
    },
    select: {
      id: true,
      name: true,
      lastname: true,
      username: true,
      role_id: true,
      role: { select: { name: true } },
      created_at: true
    }
  });
}

    public async updateUser(id: number, userUpdated: any): Promise<any> {
  const user = await this.getUserById(id);

  // Si viene role como string, buscar el id
  let roleId = user.role_id;
  if (userUpdated.role) {
    const roleRecord = await this.prisma.role.findFirst({ 
      where: { name: userUpdated.role } 
    });
    roleId = roleRecord?.id ?? user.role_id;
  }

  const hashedPassword = userUpdated.password
    ? await bcrypt.hash(userUpdated.password, 10)
    : user.password;

  return await this.prisma.user.update({
    where: { id },
    data: {
      name: userUpdated.name ?? user.name,
      lastname: userUpdated.lastname ?? user.lastname,
      username: userUpdated.username ?? user.username,
      password: hashedPassword,
      role_id: roleId
    },
    select: {
      id: true,
      name: true,
      lastname: true,
      username: true,
      role_id: true,
      role: { select: { name: true } },
      created_at: true
    }
  });
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