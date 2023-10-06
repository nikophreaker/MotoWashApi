import { Transaction } from "~/models/transactions";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const result = new Transaction({
      userId: body.userId,
      productId: body.productId.split(","),
      transactionDate: new Date(body.transactionDate),
      totalAmount: body.totalAmount,
      paymentMethod: body.paymentMethod,
      paymentStatus: body.paymentStatus,
    });
    // Admin.createIndexes();
    try {
      return (await result.save()).errors != undefined
        ? createError({
            statusCode: 500,
            data: (await result.save()).errors,
            statusMessage: "Harap coba kembali",
          })
        : result.save();
    } catch (error: any) {
      if (error.keyValue != undefined) {
        return createError({
          statusCode: 402,
          data: error.keyValue,
          statusMessage: `${Object.keys(error.keyValue)} ${Object.values(
            error.keyValue
          )} sudah terdaftar`,
        });
      } else {
        return createError({
          statusCode: 500,
          data: error.errors,
          statusMessage: `${Object.values(error.errors)}`,
        });
      }
    }
  } catch (error) {
    return createError({
      statusCode: 500,
      data: error,
      statusMessage: "Harap coba kembali",
    });
  }
});
