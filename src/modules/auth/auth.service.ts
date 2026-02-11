import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
    public logIn (){
        return "Sesion exitosa";
    }
}