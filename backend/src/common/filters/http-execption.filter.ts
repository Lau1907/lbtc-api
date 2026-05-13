import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";
import { PrismaService } from "../services/prisma.service";

// common/filters/http-exception.filter.ts

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    constructor(private readonly prisma: PrismaService) {}

    async catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const rawResponse = exception instanceof HttpException
            ? exception.getResponse()
            : { message: exception.message || 'Error inesperado', error: 'SERVER_ERROR' };

        // Extraemos el mensaje detallado para la columna "ERROR"
        const errorMessage = typeof rawResponse === 'string' 
            ? rawResponse 
            : (rawResponse as any).message || 'No details provided';

        // Solo guardamos en la base de datos si NO es un error de Auditoría (para evitar bucles)
        if (!request.url.includes('/api/logs')) {
            try {
                await this.prisma.logs.create({
                    data: {
                        statusCode: status,
                        timeStamp: new Date(),
                        path: request.url,
                        error: Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage,
                        errorcode: (rawResponse as any).error || 'ERROR_LOG',
                    }
                });
            } catch (dbErr) {
                console.error('Error al persistir log:', dbErr);
            }
        }

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: errorMessage,
        });
    }
}