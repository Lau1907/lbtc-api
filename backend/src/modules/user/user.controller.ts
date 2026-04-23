import {
    Body,
    Controller,
    Delete,
    ForbiddenException,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Req,
    UseGuards
} from "@nestjs/common";

import { Role } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from "src/common/guards/auth.guards";
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UtilService } from "src/common/services/util.service";
import { CreateUserDto } from "../auth/dto/create-user-dto";
import { UserService } from "./user.service";

@Controller("api/user")
export class UserController {

    constructor(private readonly userSvc: UserService, private readonly utilSvc: UtilService) {}

    @Get()
    @UseGuards(AuthGuard, RolesGuard)
    @Role('admin')
    public async getUsers(): Promise<any> {
        return await this.userSvc.getUsers();
    }

    @Delete(":id")
    @UseGuards(AuthGuard, RolesGuard)
    @Role('admin')
    @HttpCode(HttpStatus.OK)
    public async deleteUser(@Param("id", ParseIntPipe) id: number): Promise<boolean> {
    const result = await this.userSvc.deleteUser(id);
    if (!result)
        throw new HttpException('No se pudo eliminar el usuario', HttpStatus.INTERNAL_SERVER_ERROR);
    return result;
    }

    @Get(":id")
    public async getUserById(
        @Param("id", ParseIntPipe) id: number
    ): Promise<any> {

        const user = await this.userSvc.getUserById(id);

        if (user) return user;

        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }

    @Post()
    public async insertUser(@Body() user: CreateUserDto): Promise<any> {
        const encryptedPassword = await this.utilSvc.hashPassword(user.password);
    user.password = encryptedPassword;
    const result = await this.userSvc.insertUser(user);
    if (result == undefined || result == null) {
      throw new HttpException(
        `Error al insertar el usuario`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return result;
  }

    @Put(":id")
@UseGuards(AuthGuard)
public async updateUser(
  @Param("id", ParseIntPipe) id: number,
  @Body() user: any,
  @Req() req: any
): Promise<any> {
  const currentUserId = req['user'].sub;
  const isAdmin = req['user'].role === 'admin';

  if (!isAdmin && currentUserId !== id) {
    throw new ForbiddenException('No puedes editar el perfil de otro usuario');
  }

  const result = await this.userSvc.updateUser(id, user);

  //Log de cambio de rol
  if (user.role) {
    await this.userSvc.saveLog(
      200,
      '/api/user',
      `Cambio de rol: usuario ${id} cambió a ${user.role} por usuario ${currentUserId}`,
      'ROLE_CHANGED'
    );
  }

  return result;
}

}