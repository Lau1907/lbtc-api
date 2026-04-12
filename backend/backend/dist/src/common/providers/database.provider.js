"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProviders = void 0;
const pg_1 = require("pg");
exports.databaseProviders = [
    {
        provide: 'DATABASE_CONNECTION',
        useFactory: async () => {
            const client = new pg_1.Client({
                host: 'localhost',
                port: 5432,
                user: 'admin',
                password: 'Lbtc123',
                database: 'lbtc_db',
            });
            await client.connect();
            console.log('📦 Base de datos conectada');
            return client;
        },
    },
];
//# sourceMappingURL=database.provider.js.map