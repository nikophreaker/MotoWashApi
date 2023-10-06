import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const con = await mysql.createConnection(config.mysql);
    const body = await readBody(event);
    const [data, fields] = await con.query(`UPDATE customer SET name = '${body.name}', email = '${body.email}', phone = '${body.phone}', loyalty_points = '${body.loyaltyPoints}' WHERE id = ${body.id}`);
    return {
      statusCode: 200,
      data: data,
    };
  } catch (error) {
    return createError({
      statusCode: 500,
      data: error,
      statusMessage: "Harap coba kembali",
    });
  }
});
