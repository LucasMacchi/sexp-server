import { Client } from 'pg';
import 'dotenv/config'


const db_host = process.env.DB_HOST ?? 'localhost'
const db_port: number = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432
const db_username = process.env.DB_USER ?? 'root'
const db_password = process.env.DB_PASSWORD ?? 'root'
const db_databse = process.env.DB_NAME ?? 'test'

export default function () {
    const client = new Client({
        user: db_username,
        password: db_password,
        host: db_host,
        port: db_port,
        database: db_databse,
        ssl: false//{rejectUnauthorized: false}
    })
    return client
}