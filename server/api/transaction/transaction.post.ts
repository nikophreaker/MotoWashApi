import { Transaction } from "~/models/transactions";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    const result = new Transaction({
      userId: body.userId, 
      productId: body.productId.split(","), 
      transactionDate: new Date(body.transactionDate), 
      totalAmount: body.totalAmount, 
      paymentMethod: body.paymentMethod,
      paymentStatus: body.paymentStatus
    });
    // Admin.createIndexes();
    try {
      return (await result.save()).errors != undefined ? {
        status: 500,
        error: (await result.save()).errors,
        message: "Harap coba kembali"
      } : result.save();
    } catch (error: any) {
      if (error.keyValue != undefined) {
        return {
          status: 500,
          error: error.keyValue,
          message: `${Object.keys(error.keyValue)} ${Object.values(error.keyValue)} sudah terdaftar`
        };
      } else {
        return {
          status: 500,
          error: error,
          message: "Harap coba kembali"
        };
      }
    }
  } catch (error) {
    return {
    status: 500,
    error: error,
    message: "Harap coba kembali"
  }
  }
});
