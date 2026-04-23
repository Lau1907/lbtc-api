import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, Reflector } from '@nestjs/core';
import { AllExceptionFilter } from './common/filters/http-execption.filter';
import { RolesGuard } from './common/guards/roles.guard';
import { DatabaseModule } from './common/providers/database.module';
import { PrismaService } from './common/services/prisma.service';
import { UtilService } from './common/services/util.service';
import { AuthModule } from './modules/auth/auth.module';
import { LogsController } from './modules/logs/logs.controller';
import { TaskModule } from './modules/task/task.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [AuthModule, TaskModule, DatabaseModule, UserModule, ConfigModule.forRoot()],
  controllers: [LogsController],
  providers: [
    PrismaService,
    UtilService,
    RolesGuard,
    Reflector,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
  exports: [PrismaService]
})
export class AppModule {}