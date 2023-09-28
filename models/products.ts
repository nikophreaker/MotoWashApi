import { defineMongooseModel } from "#nuxt/mongoose";

export const Product = defineMongooseModel({
  name: "Product",
  schema: {
    name: {
      type: String,
      required: true,
      index: "text"
    },
    description: {
      type: String,
      required: true,
      index: "text"
    },
    stockQuantity: {
      type: Number,
      required: true,
    },
    price: {
      type: String,
      required: true,
      index: "text"
    },
  },
});
