import { defineMongooseModel } from "#nuxt/mongoose";
import { mongo } from "mongoose";

export const Payment = defineMongooseModel({
  name: "Payment",
  schema: {
    transactionId: {
      type: mongo.ObjectId,
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
