import { defineMongooseModel } from "#nuxt/mongoose";

export const Transaction = defineMongooseModel({
  name: "Transaction",
  schema: {
    userId: {
      type: Number,
      required: true,
    },
    productId: {
      type: Number,
      required: true,
    },
    transactionDate: {
      type: Date,
      required: true,
    },
    totalAmount: {
      type: String,
      required: true,
      index: "text"
    },
  },
});
