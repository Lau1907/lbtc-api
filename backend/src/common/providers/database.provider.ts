import { Client } from "pg";

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () => {
      const client = new Client({
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