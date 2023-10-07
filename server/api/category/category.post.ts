import { sql } from '../../db/dbconnection'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    return await sql({
      query: `INSERT INTO category (name) VALUES ('${body.name}')`
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
