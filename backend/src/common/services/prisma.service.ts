import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import * as dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
        const adapter = new PrismaPg(pool);
        super({ adapter });
    }

    async onModuleInit() {
        try {
            await this.$connect();
            console.log('Conexión a la base de datos establecida con éxito.');
        } catch (error) {
            console.error('Error al conectar con la base de datos:', error);
        }
    }
}