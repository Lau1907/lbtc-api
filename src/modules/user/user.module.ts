import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/common/providers/database.module";
import { UtilService } from "src/common/services/util.service";
import { PrismaModule } from "src/prisma.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [DatabaseModule, PrismaModule],
    controllers: [UserController],
    providers: [UserService, UtilService],
    exports: [UserService],
})
export class UserModule {}