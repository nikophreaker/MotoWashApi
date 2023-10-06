import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const con = await mysql.createConnection(config.mysql);
    const body = await readBody(event);
    let query = body ? body.query : "";
    const [data, fields] = await con.query(`SELECT product.id, product.name, product.description, category.name AS categoryName, category.id AS categoryId, product.stock, product.price FROM product JOIN category ON category.id = product.category_id WHERE product.name LIKE '%${query}%' OR product.description LIKE '%${query}%' OR category.name LIKE '%${query}%' OR product.stock LIKE '%${query}%' OR product.price LIKE '%${query}%'`)
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
