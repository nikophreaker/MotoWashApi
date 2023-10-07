import { sql } from '../../db/dbconnection'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    return await sql({
      query: `UPDATE discounts SET code = '${body.code}', description = '${body.description}', type = '${body.type}', value = '${body.value}', start_date = '${body.startDate}', end_date = '${body.endDate}' WHERE id = ${body.id}`
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
