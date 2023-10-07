import { sql } from '../../db/dbconnection'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    let query = body ? body.query : "";
    return await sql({
      query: `SELECT * FROM customer WHERE name LIKE '%${query}%' OR email LIKE '%${query}%' OR phone LIKE '%${query}%' OR loyalty_points LIKE '%${query}%'`
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