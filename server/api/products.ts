import { Product } from "~/models/products";

export default defineEventHandler(async (event) => {
  try {
    const result = await Product.find();
    return result;
  } catch (error) {
    console.log(error);
  }
});
