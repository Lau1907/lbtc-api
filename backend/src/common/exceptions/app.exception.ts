import { HttpException, HttpStatus } from "@nestjs/common";

export class AppException extends HttpException {

    constructor(
        readonly message: string, 
        readonly statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
        readonly errorCode: string
    ) {
        super(message, statusCode);
    }   
}