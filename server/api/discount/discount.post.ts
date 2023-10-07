import { sql } from '../../db/dbconnection'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    return await sql({
      query: `INSERT INTO discounts (code, description, type, value, start_date, end_date) VALUES ('${body.code}','${body.description}','${body.type}','${body.value}','${body.startDate}','${body.endDate}')`
    }).then((res: any) => {
      return {
        statusCode: 200,
        data: res[0],
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
