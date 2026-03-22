import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/common/providers/database.module";
import { PrismaModule } from "src/prisma.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [DatabaseModule, PrismaModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}