// import { config } from "dotenv";
import { Pool } from 'pg';

// config();

const pool = new Pool({
    user: 'root',
    host: 'db',
    database: 'uptime-bot',
    password: '1234'
});

export { pool }