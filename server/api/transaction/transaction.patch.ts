import { Transaction } from "~/models/transactions";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const result = Transaction.findOneAndUpdate(
      { _id: body.id },
      {
        userId: body.userId,
        productId: body.productId.split(","),
        transactionDate: new Date(body.transactionDate),
        totalAmount: body.totalAmount,
        paymentMethod: body.paymentMethod,
        paymentStatus: body.paymentStatus,
      }
    );
    // Admin.createIndexes();
    const res = result
      .then((res) => {
        console.log(res);
        return res?.errors != undefined
          ? createError({
              statusCode: 500,
              data: res?.errors,
              statusMessage: "Harap coba kembali",
            })
          : res;
      })
      .catch((err) => {
        if (err.keyValue != undefined) {
          return createError({
            statusCode: 402,
            data: err.keyValue,
            statusMessage: `${Object.keys(err.keyValue)} ${Object.values(
              err.keyValue
            )} sudah terdaftar`,
          });
        } else {
          return createError({
            statusCode: 500,
            data: err.errors,
            statusMessage: `${Object.values(err.errors)}`,
          });
        }
      });
    return res;
  } catch (error) {
    return createError({
      statusCode: 500,
      data: error,
      statusMessage: "Harap coba kembali",
    });
  }
});
