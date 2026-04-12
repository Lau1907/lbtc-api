import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from './common/filters/http-execption.filter.ts.js';
import { DatabaseModule } from './common/providers/database.module.js';
import { PrismaService } from './common/services/prisma.service.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { TaskModule } from './modules/task/task.module.js';
import { UserModule } from './modules/user/user.module.js';
@Module({
  imports: [AuthModule, TaskModule, DatabaseModule, UserModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [PrismaService,
    {
    provide: APP_FILTER,
    useClass: AllExceptionFilter,
  },
  ],
  exports: [PrismaService]
})
export class AppModule {}
