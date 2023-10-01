import { Product } from "~/models/products";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const result = await Product.find({ "$or": [
      {
        name: {
          $regex: body.query,
          $options: "i"
        },
        description: {
          $regex: body.query,
          $options: "i"
        },
        price: {
          $regex: body.query,
          $options: "i"
        }
      }
    ] })//.skip(body.skip).limit(body.limit);
    return result;
  } catch (error) {
    return {
      status: 500,
      error: error,
      message: "Harap coba kembali"
    };
  }
})