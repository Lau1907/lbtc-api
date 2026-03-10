import { Module } from '@nestjs/common';
import { DatabaseModule } from './common/providers/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './modules/task/task.module';
import { UserModule } from './modules/user/user.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [AuthModule, TaskModule, DatabaseModule, UserModule],
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService]
})
export class AppModule {}
