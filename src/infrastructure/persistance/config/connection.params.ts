import * as dotenv from 'dotenv';
dotenv.config();

const DB_USER = process.env.DB_USER || '';
const DB_HOST = process.env.DB_HOST || '';
const DB_NAME = process.env.DB_NAME || '';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_PORT = process.env.DB_PORT || '';

/**
 * Connection params for the db
 */
export const connectionDBParams = {
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: Number(DB_PORT),
}