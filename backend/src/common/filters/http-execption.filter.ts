import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { PrismaService } from "../services/prisma.service";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {

    constructor(private readonly prisma: PrismaService) {}

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = exception instanceof HttpException
            ? exception.getResponse()
            : 'Internal server error';

const errorMessage = typeof message === 'string' 
  ? message 
  : Array.isArray((message as any).message)
    ? (message as any).message.join(', ')
    : (message as any).message;
        // 👇 Guardar en BD
        this.prisma.logs.create({
            data: {
                statusCode: status,
                timeStamp: new Date(),
                path: request.url,
                error: errorMessage ?? 'Unknown error',
                errorcode: (message as any).error ?? 'UNEXPECTED_ERROR',
            }
        }).catch(err => console.error('Error al guardar log:', err));

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: errorMessage,
            errorCode: (message as any).error || 'UNEXPECTED_ERROR',
        });
    }
}