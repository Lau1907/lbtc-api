import { Client } from "pg";
import { PrismaService } from "src/common/services/prisma.service";
import { CreateTaskDto } from "../auth/dto/create-task-dto";
import { UpdateTaskDto } from "../auth/dto/update-task-dto";
import { Task } from "../auth/entities/task.entity";
export declare class TaskService {
    private db;
    private prisma;
    constructor(db: Client, prisma: PrismaService);
    private tasks;
    getTasks(): Promise<Task[]>;
    getTaskById(id: number): Promise<Task>;
    insertTask(task: CreateTaskDto): Promise<Task>;
    updateTask(id: number, taskUpdated: UpdateTaskDto): Promise<Task>;
    deleteTask(id: number): Promise<boolean>;
}
