import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const con = await mysql.createConnection(config.mysql);
    const body = await readBody(event);
    const [data, fields] = await con.query(`INSERT INTO customer (name, email, phone, loyalty_points) VALUES ('${body.name}','${body.email}','${body.phone}','${body.loyaltyPoints}')`);
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
