import { HttpException, HttpStatus } from "@nestjs/common";
export declare class AppException extends HttpException {
    readonly message: string;
    readonly statusCode: HttpStatus;
    readonly errorCode: string;
    constructor(message: string, statusCode: HttpStatus | undefined, errorCode: string);
}
