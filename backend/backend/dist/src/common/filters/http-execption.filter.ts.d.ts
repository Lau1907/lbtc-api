import { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";
export declare class AllExceptionFilter implements ExceptionFilter {
    private readonly prisma;
    constructor(prisma: PrismaService);
    catch(exception: any, host: ArgumentsHost): void;
}
