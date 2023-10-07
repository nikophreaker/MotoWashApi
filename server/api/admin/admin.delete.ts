import { sql } from '../../db/dbconnection'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    return await sql({
      query: `DELETE FROM admin WHERE id = ${body.id}`
    }).then((res: any) => {
      res.con.release()
      return {
        statusCode: 200,
        data: res.cq[0],
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
