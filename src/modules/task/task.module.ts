import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/common/providers/database.module";
import { PrismaModule } from "src/prisma.module";
import { TaskController } from "./task.controller";
import { TaskService } from "./task.service";

@Module({
    imports: [DatabaseModule, PrismaModule],
    controllers: [TaskController],
    providers: [TaskService],
})
export class TaskModule {}