import { sql } from '../../db/dbconnection'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    return await sql({
      query: `INSERT INTO admin (name, email, password, phone, role) VALUES ('${body.name}','${body.email}','${body.password}','${body.phone}','${body.role}')`
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
