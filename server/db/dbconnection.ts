import { error } from 'console';
import mysql from 'mysql2/promise'

interface Options {
    query: string,
    values?: any,
}

const config = useRuntimeConfig();
const pool = mysql.createPool(config.mysql)

export const sql = async ({ query, values }: Options) => {
    return await pool.getConnection()
        .then(async (connection) => {
            return {
                con: connection,
                cq: await connection.query(query, values)
            }
        })
        .catch((error) => {
            if (error) throw error;
        })
};