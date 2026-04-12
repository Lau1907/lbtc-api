import { Client } from "pg";
export declare const databaseProviders: {
    provide: string;
    useFactory: () => Promise<Client>;
}[];
