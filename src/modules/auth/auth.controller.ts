import { Body, Controller, Get, HttpCode, HttpStatus, Post, UnauthorizedException } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { AuthService } from "./auth.service";

@Controller("api/auth")
export class AuthController{
    utilSvc: any;
    constructor(private  readonly authSvc: AuthService){}

    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiOperation( {summary: 'Extrae el Id del usuario desde el token y busca la informacion'})
    public async login(@Body() auth): Promise<any> {
        const { username, password } = auth;

        const user = await this.authSvc.getUserByUsername(username);

        if(!user)
            throw new UnauthorizedException('El usuario y/o contrseña son incorrectas');
        if(await this.utilSvc.checkPassword(password, user.password!)){
            const { password,...payload} = user;

            const jwt = await this.utilSvc.generateJWT(payload);


            return { access_token: jwt, refresh_token: ''};
        }else{
            throw new UnauthorizedException('El usuario y/o contrseña son incorrectas')
        }
    }

    @Get("me")
    public async getProfile(){

    }

}