import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put
} from "@nestjs/common";

import { UserService } from "./user.service";

@Controller("api/user")
export class UserController {

    constructor(private readonly userSvc: UserService) {}

    @Get()
    public async getUsers(): Promise<any> {
        return await this.userSvc.getUsers();
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
    public async insertUser(@Body() user: any): Promise<any> {
        return await this.userSvc.insertUser(user);
    }

    @Put(":id")
    public updateUser(
        @Param("id", ParseIntPipe) id: number,
        @Body() user: any
    ): any {
        return this.userSvc.updateUser(id, user);
    }

    @Delete(":id")
    @HttpCode(HttpStatus.OK)
    public async deleteUser(
        @Param("id", ParseIntPipe) id: number
    ): Promise<boolean> {

        const result = await this.userSvc.deleteUser(id);

        if (!result)
            throw new HttpException(
                "No se pudo eliminar el usuario",
                HttpStatus.INTERNAL_SERVER_ERROR
            );

        return result;
    }
}