import { defineMongooseModel } from "#nuxt/mongoose";

export const Payment = defineMongooseModel({
  name: "Payment",
  schema: {
    userId: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentDate: {
      type: Date,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: String,
      required: true,
    },
  },
});
