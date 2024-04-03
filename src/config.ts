import * as dotenv from 'dotenv';

dotenv.config({ path: `.env` });

interface Config {
    server: string;
    database: string;
    port: number;
    user: string;
    password: string;
    options: { encrypt: boolean };
}

const dbConfig: Config = {
    server: process.env.AZURE_SQL_SERVER!,
    database: process.env.AZURE_SQL_DATABASE!,
    port: parseInt(process.env.AZURE_SQL_PORT || ''),
    user: process.env.AZURE_SQL_USER!,
    password: process.env.AZURE_SQL_PASSWORD!,
    options: {
        encrypt: true
    }
};

export { dbConfig };
