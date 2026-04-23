import { Module } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RolesGuard } from "src/common/guards/roles.guard";
import { DatabaseModule } from "src/common/providers/database.module";
import { UtilService } from "src/common/services/util.service";
import { PrismaModule } from "src/prisma.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";


@Module({
    imports: [DatabaseModule, PrismaModule],
    controllers: [UserController],
    providers: [UserService, UtilService, RolesGuard, Reflector],
    exports: [UserService],
})
export class UserModule {}