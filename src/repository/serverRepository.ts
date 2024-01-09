import { Server } from "../models/server";
import { pool } from "./dbClient";

const getServerById = async (id: string): Promise<Server | null> => {
    const server = await pool.query(`
        SELECT id, name FROM server WHERE id = $1`, [id]);
    return server.rows[0];
};

const createServer = async ({ id, name }: Server) => {
    await pool.query(`INSERT INTO server (id, name) VALUES ($1, $2)`, [id, name]);
}

export { getServerById, createServer }