import { Product } from "~/models/products";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const result = await Product.findOneAndDelete({_id: body.id});
    return result;
  } catch (error) {
    return {
    status: 500,
    error: error,
    message: "Harap coba kembali"
  }
  }
});
