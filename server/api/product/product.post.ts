import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const con = await mysql.createConnection(config.mysql);
    const body = await readBody(event);
    const [data, fields] = await con.query(`INSERT INTO product (name, description, category_id, stock, price) VALUES ('${body.name}','${body.description}','${body.category_id}','${body.stock}','${body.price}')`);
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
