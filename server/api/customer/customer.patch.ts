import { sql } from '../../db/dbconnection'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    return await sql({
      query: `UPDATE customer SET name = '${body.name}', email = '${body.email}', phone = '${body.phone}', loyalty_points = '${body.loyaltyPoints}' WHERE id = ${body.id}`
    }).then((res: any) => {
      return {
        statusCode: 200,
        data: res[0],
      }
    }).catch((error) => {
      if (error) throw error;
    })
  } catch (error) {
    return createError({
      statusCode: 500,
      data: error,
      statusMessage: "Harap coba kembali",
    });
  }
});
