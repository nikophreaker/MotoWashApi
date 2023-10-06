import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const con = await mysql.createConnection(config.mysql);
    const body = await readBody(event);
    const [data, fields] = await con.query(`UPDATE product SET name = '${body.name}', description = '${body.description}', category_id = '${body.category_id}', stock = '${body.stock}', price = '${body.price}' WHERE id = ${body.id}`);
    return {
      statusCode: 200,
      data: data,
    };
  } catch (error) {
    console.log(error);
    return createError({
      statusCode: 500,
      data: error,
      statusMessage: "Harap coba kembali",
    });
  }
});
