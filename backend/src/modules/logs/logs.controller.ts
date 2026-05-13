import { Controller, Delete, Get, Query, UseGuards } from '@nestjs/common'; // Añadimos Delete
import { Role } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PrismaService } from 'src/common/services/prisma.service';

@Controller('api/logs')
export class LogsController {

  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Role('admin')
  public async getLogs(
    @Query('path') path?: string,
    @Query('statusCode') statusCode?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('username') username?: string,
  ) {
    return await this.prisma.logs.findMany({
      where: {
        ...(path && { path: { contains: path, mode: 'insensitive' } }),
        ...(statusCode && { statusCode: parseInt(statusCode) }),
        ...(from && to && {
          timeStamp: {
            gte: new Date(from),
            lte: new Date(to)
          }
        }),
        // Ajuste: asumiendo que tienes un campo username en tu tabla logs
        ...(username && { username: { contains: username, mode: 'insensitive' } })
      },
      orderBy: { timeStamp: 'desc' },
      take: 100
    });
  }

  // --- NUEVO MÉTODO PARA VACIAR LA TABLA ---
  @Delete()
  @UseGuards(AuthGuard, RolesGuard)
  @Role('admin')
  public async clearLogs() {
    await this.prisma.logs.deleteMany({});
    return { message: 'Logs eliminados correctamente' };
  }
}