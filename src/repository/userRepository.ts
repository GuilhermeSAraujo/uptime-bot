import { User } from "../models/user";
import { pool } from "./dbClient";

const getUserById = async (id: string): Promise<User | null> => {
    const user = await pool.query(`
        SELECT id, display_name as "displayName", tag
        FROM person
        WHERE id = $1`,
        [id]);
    return user.rows[0];
};

const createUser = async ({ id, displayName, tag }: User) => {
    await pool.query(`
        INSERT INTO person (id, display_name, tag) VALUES ($1, $2, $3)`,
        [id, displayName, tag]);
}

export { getUserById, createUser }