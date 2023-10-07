import { sql } from '../../db/dbconnection'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const arrItem: Array<String> = body.productId.split(',')
    const orderData = {
      customer_id: body.customerId,
      total_amount: body.totalAmount,
    };

    return await sql({
      query: `INSERT INTO orders SET ?`,
      values: orderData
    }).then(async (resOrder: any) => {

      const transactionData = {
        customer_id: body.customerId,
        orders_id: resOrder[0].insertId,
        payment_method: body.paymentMethod,
        payment_status: body.paymentStatus,
      };

      return await sql({
        query: `INSERT INTO transaction SET ?`,
        values: transactionData
      }).then(async (resTransaction: any) => {

        const insertedItemIds: any[] = [];
        arrItem.forEach(async (el, idx) => {

          const itemsData = {
            orders_id: resTransaction[0].insertId,
            product_id: body.productId.split(',')[idx],
            quantity: body.quantity.split(',')[idx],
            price: body.price.split(',')[idx],
          };

          await sql({
            query: `INSERT INTO order_items SET ?`,
            values: itemsData
          }).then((resItem: any) => {
            insertedItemIds.push(resItem[0])
          }).catch((error) => {
            if (error) throw error;
          })
        })
        return {
          statusCode: 200,
          data: insertedItemIds,
        }
      }).catch((error) => {
        if (error) throw error;
      })
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
