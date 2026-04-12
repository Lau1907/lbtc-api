import { CanActivate, ExecutionContext } from "@nestjs/common";
import { UtilService } from '../services/util.service';
export declare class AuthGuard implements CanActivate {
    private readonly utilSvc;
    constructor(utilSvc: UtilService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
