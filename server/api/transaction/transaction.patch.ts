import { Transaction } from "~/models/transactions";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const result = Transaction.findOneAndUpdate({_id: body.id}, {
      userId: body.userId, 
      productId: body.productId.split(","), 
      transactionDate: new Date(body.transactionDate), 
      totalAmount: body.totalAmount, 
      paymentMethod: body.paymentMethod,
      paymentStatus: body.paymentStatus
    });
    // Admin.createIndexes();
    const res = result.then((res)=>{
      console.log(res);
      return res?.errors != undefined ? {
            status: 500,
            error: res?.errors,
            message: "Harap coba kembali"
          } : res;
    }).catch((err)=>{
        if (err.keyValue != undefined) {
          return {
            status: 500,
            error: err.keyValue,
            message: `${Object.keys(err.keyValue)} ${Object.values(err.keyValue)} sudah terdaftar`
          };
        } else {
          return {
            status: 500,
            error: err,
            message: "Harap coba kembali"
          };
        }
    })
    return res;
  } catch (error) {
    return {
    status: 500,
    error: error,
    message: "Harap coba kembali"
  }
  }
});
