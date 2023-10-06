import { Payment } from "~/models/payment";
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const result = new Payment({transactionId: body.transactionId, paymentMethod: body.paymentMethod, paymentDate: new Date(body.paymentDate), paymentStatus: body.paymentStatus, totalAmount: body.totalAmount});
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
