import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const con = await mysql.createConnection(config.mysql);
    const body = await readBody(event);
    const [data, fields] = await con.query(`INSERT INTO category (name) VALUES ('${body.name}')`);
    return {
      statusCode: 200,
      data: data,
    };
  } catch (error: any) {
    return createError({
      statusCode: 500,
      data: error,
      statusMessage: `${error.message}`,
    });
  }
});
