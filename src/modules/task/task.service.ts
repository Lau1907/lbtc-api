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

    // ➕ Insertar tarea
    public async insertTask(task: CreateTaskDto): Promise<Task> {
        const query = `
            INSERT INTO tasks (name, description, priority, user_id)
            VALUES ('${task.name}', '${task.description}', ${task.priority}, ${task.user_id})
            RETURNING *
        `;

        const result = await this.db.query(query);
        return result.rows[0];
    }

    public async updateTask(
        id: number,
        taskUpdated: UpdateTaskDto
    ): Promise<Task> {

        const task = await this.getTaskById(id);

        task.name = taskUpdated.name ?? task.name;
        task.description = taskUpdated.description ?? task.description;
        task.priority = taskUpdated.priority ?? task.priority;

        const query = `
            UPDATE tasks
            SET 
                name = '${task.name}',
                description = '${task.description}',
                priority = ${task.priority}
            WHERE id = ${id}
            RETURNING *
        `;

        const result = await this.db.query(query);
        return result.rows[0];
    }

    // 🗑️ Eliminar tarea
    public async deleteTask(id: number): Promise<boolean> {
    await this.getTaskById(id);

    const sql = `DELETE FROM tasks WHERE id = ${id}`;
    const result = await this.db.query(sql);

    return result.rows.length > 0;
}
}
