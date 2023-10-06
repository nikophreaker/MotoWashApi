import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const con = await mysql.createConnection(config.mysql);
    const body = await readBody(event);
    let query = body ? body.query : "";
    const [data, fields] = await con.query(`SELECT customer.name, product.name FROM transaction JOIN customer ON customer.id = transaction.customer_id JOIN product ON product.id = transaction.product_id WHERE customer.name LIKE '%${query}%' OR product.name LIKE '%${query}%' OR transaction.payment_method LIKE '%${query}%' OR transaction.payment_status LIKE '%${query}%'`)
    return {
      statusCode: 200,
      data: data,
    };
  } catch (error: any) {
    console.log(error);
    return createError({
      statusCode: 500,
      data: error,
      statusMessage: `${error.message}`,
    });
  }
});