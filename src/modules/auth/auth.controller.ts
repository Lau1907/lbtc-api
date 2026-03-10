import { Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { AuthService } from "./auth.service";

@Controller("api/auth")
export class AuthController{
    constructor(private  readonly authSvc: AuthService){}

    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiOperation( {summary: 'Extrae el Id del usuario desde el token y busca la informacion'})
    public login(): string{
        return this.authSvc.logIn();
    }

    @Get("me")
    public async getProfile(){

    }

}