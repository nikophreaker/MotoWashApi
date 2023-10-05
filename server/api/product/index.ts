import { Product } from "~/models/products";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    let query = body ? body.query : "";
    const result = await Product.find({
      $or: [
        {
          name: {
            $regex: query,
            $options: "i",
          },
          description: {
            $regex: query,
            $options: "i",
          },
          price: {
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
