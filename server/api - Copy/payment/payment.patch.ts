import { Payment } from "~/models/payment";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const result = Payment.findOneAndUpdate({_id: body.id}, {transactionId: body.transactionId, paymentMethod: body.paymentMethod, paymentDate: new Date(body.paymentDate), paymentStatus: body.paymentStatus, totalAmount: body.totalAmount});
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
