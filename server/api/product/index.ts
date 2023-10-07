import { sql } from '../../db/dbconnection'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    let query = body ? body.query : "";
    return await sql({
      query: `SELECT product.id, product.name, product.description, category.name AS categoryName, category.id AS categoryId, product.stock, product.price FROM product JOIN category ON category.id = product.category_id WHERE product.name LIKE '%${query}%' OR product.description LIKE '%${query}%' OR category.name LIKE '%${query}%' OR product.stock LIKE '%${query}%' OR product.price LIKE '%${query}%'`
    }).then((res: any) => {
      res.con.release()
      return {
        statusCode: 200,
        data: res.cq[0],
      }
    }).catch((error) => {
      if (error) throw error;
    })
  } catch (error: any) {
    return createError({
      statusCode: 500,
      data: error,
      statusMessage: `${error.message}`,
    });
  }
});
