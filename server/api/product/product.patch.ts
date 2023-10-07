import { sql } from '../../db/dbconnection'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    return await sql({
      query: `UPDATE product SET name = '${body.name}', description = '${body.description}', category_id = '${body.category_id}', stock = '${body.stock}', price = '${body.price}' WHERE id = ${body.id}`
    }).then((res: any) => {
      return {
        statusCode: 200,
        data: res[0],
      }
    }).catch((error) => {
      if (error) throw error;
    })
  } catch (error) {
    console.log(error);
    return createError({
      statusCode: 500,
      data: error,
      statusMessage: "Harap coba kembali",
    });
  }
});
