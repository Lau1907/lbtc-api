import { Controller, Get, Query, UseGuards } from '@nestjs/common';
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
        ...(path && { path: { contains: path } }),
        ...(statusCode && { statusCode: parseInt(statusCode) }),
        ...(from && to && {
          timeStamp: {
            gte: new Date(from),
            lte: new Date(to)
          }
        }),
        ...(username && { error: { contains: username}})
      },
      orderBy: { timeStamp: 'desc' },
      take: 100
    });
  }
}