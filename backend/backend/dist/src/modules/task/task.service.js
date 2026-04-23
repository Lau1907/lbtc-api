"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const prisma_service_1 = require("../../common/services/prisma.service");
let TaskService = class TaskService {
    db;
    prisma;
    constructor(db, prisma) {
        this.db = db;
        this.prisma = prisma;
    }
    tasks = [];
    async getTasks() {
        const tasks = await this.prisma.task.findMany();
        return tasks;
    }
    async getTaskById(id) {
        const task = await this.prisma.task.findUnique({
            where: { id }
        });
        if (!task) {
            throw new Error(`Task with id ${id} not found`);
        }
        return task;
    }
    async insertTask(task) {
        const name = task.name?.trim().substring(0, 100) ?? '';
        const description = task.description?.trim().substring(0, 500) ?? '';
        if (!name)
            throw new Error('El nombre es requerido');
        return await this.prisma.task.create({
            data: {
                name,
                description,
                priority: task.priority ?? false,
                user_id: task.user_id
            }
        });
    }
    async updateTask(id, taskUpdated) {
        return await this.prisma.task.update({
            where: { id },
            data: {
                name: taskUpdated.name,
                description: taskUpdated.description,
                priority: taskUpdated.priority
            }
        });
    }
    async deleteTask(id) {
        await this.prisma.task.delete({
            where: { id }
        });
        return true;
    }
    async getTasksByUser(userId) {
        return await this.prisma.task.findMany({
            where: { user_id: userId }
        });
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DATABASE_CONNECTION')),
    __metadata("design:paramtypes", [pg_1.Client,
        prisma_service_1.PrismaService])
], TaskService);
//# sourceMappingURL=task.service.js.map