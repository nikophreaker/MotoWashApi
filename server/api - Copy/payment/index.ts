import { Payment } from "~/models/payment";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    let query = body ? body.query : "";
    const result = await Payment.find({
      $or: [
        {
          name: {
            $regex: query,
            $options: "i",
          },
          email: {
            $regex: query,
            $options: "i",
          },
          phone: {
            $regex: query,
            $options: "i",
          },
          licensePlates: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    }); //.skip(body.skip).limit(body.limit);
    return result;
  } catch (error) {
    return {
      status: 500,
      error: error,
      message: "Harap coba kembali",
    };
  }
});
