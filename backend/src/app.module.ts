import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from './common/filters/http-execption.filter';
import { DatabaseModule } from './common/providers/database.module';
import { PrismaService } from './common/services/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './modules/task/task.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [AuthModule, TaskModule, DatabaseModule, UserModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
  exports: [PrismaService]
})
export class AppModule {}