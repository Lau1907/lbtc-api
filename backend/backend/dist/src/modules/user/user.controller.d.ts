import { UtilService } from "src/common/services/util.service";
import { CreateUserDto } from "../auth/dto/create-user-dto";
import { UserService } from "./user.service";
export declare class UserController {
    private readonly userSvc;
    private readonly utilSvc;
    constructor(userSvc: UserService, utilSvc: UtilService);
    getUsers(): Promise<any>;
    getUserById(id: number): Promise<any>;
    insertUser(user: CreateUserDto): Promise<any>;
    updateUser(id: number, user: any): any;
    deleteUser(id: number): Promise<boolean>;
}
