import { defineMongooseModel } from "#nuxt/mongoose";
import { mongo } from "mongoose";

export const Transaction = defineMongooseModel({
  name: "Transaction",
  schema: {
    userId: {
      type: mongo.ObjectId,
      required: true,
    },
    productId: {
      type: [mongo.ObjectId],
      required: true,
    },
    transactionDate: {
      type: Date,
      required: true,
    },
    totalAmount: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
  },
});
