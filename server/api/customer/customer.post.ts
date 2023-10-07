import { sql } from '../../db/dbconnection'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    return await sql({
      query: `INSERT INTO customer (name, email, phone, loyalty_points) VALUES ('${body.name}','${body.email}','${body.phone}','${body.loyaltyPoints}')`
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
