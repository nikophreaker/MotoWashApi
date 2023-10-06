import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const con = await mysql.createConnection(config.mysql);
    const body = await readBody(event);
    let query = body ? body.query : "";
    const [data, fields] = await con.query(`SELECT * FROM customer WHERE name LIKE '%${query}%' OR email LIKE '%${query}%' OR phone LIKE '%${query}%' OR loyalty_points LIKE '%${query}%'`)
    return {
      statusCode: 200,
      data: data,
    };
  } catch (error: any) {
    console.log(error);
    return createError({
      statusCode: 500,
      data: error,
      statusMessage: `${error.message}`,
    });
  }
});