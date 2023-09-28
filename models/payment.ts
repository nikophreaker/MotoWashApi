import { defineMongooseModel } from "#nuxt/mongoose";

export const Payment = defineMongooseModel({
  name: "Payment",
  schema: {
    userId: {
      type: Number,
      unique: true,
      required: true,
    },
    transactionId: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      index: "text"
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
      index: "text"
    },
    totalAmount: {
      type: String,
      required: true,
      index: "text"
    },
  },
});
