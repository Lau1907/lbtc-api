import { Module } from '@nestjs/common';
import { DatabaseModule } from './common/providers/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './modules/task/task.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [AuthModule, TaskModule, DatabaseModule],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService]
})
export class AppModule {}
