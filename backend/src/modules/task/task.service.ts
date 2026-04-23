import { Inject, Injectable } from "@nestjs/common";
import { Client } from "pg";
import { PrismaService } from "src/common/services/prisma.service";
import { CreateTaskDto } from "../auth/dto/create-task-dto";
import { UpdateTaskDto } from "../auth/dto/update-task-dto";
import { Task } from "../auth/entities/task.entity";

@Injectable()
export class TaskService {

    constructor(
        @Inject('DATABASE_CONNECTION') private db: Client, 
        private prisma: PrismaService
    ) {}
    private tasks: any[] = [];

    public async getTasks(): Promise<Task[]> {
        const tasks = await this.prisma.task.findMany();
        return tasks;
    }

    public async getTaskById(id: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({
        where: { id }
    });

    if (!task) {
        throw new Error(`Task with id ${id} not found`);
    }

    return task;
}

public async insertTask(task: CreateTaskDto): Promise<Task> {
  // Sanitización
  const name = task.name?.trim().substring(0, 100) ?? '';
  const description = task.description?.trim().substring(0, 500) ?? '';

  if (!name) throw new Error('El nombre es requerido');

  return await this.prisma.task.create({
    data: {
      name,
      description,
      priority: task.priority as boolean ?? false,
      user_id: task.user_id!
    }
  });
}

    public async updateTask(id: number, taskUpdated: UpdateTaskDto): Promise<Task> {
  return await this.prisma.task.update({
    where: { id },
    data: {
      name: taskUpdated.name,
      description: taskUpdated.description,
      priority: taskUpdated.priority as boolean
    }
  });
}

    // 🗑️ Eliminar tarea
    public async deleteTask(id: number): Promise<boolean> {
  await this.prisma.task.delete({
    where: { id }
  });
  return true;
}

public async getTasksByUser(userId: number): Promise<Task[]> {
  return await this.prisma.task.findMany({
    where: { user_id: userId }
  });
}
}
