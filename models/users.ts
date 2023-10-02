import { defineMongooseModel } from "#nuxt/mongoose";

export const User = defineMongooseModel({
  name: "User",
  schema: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    joinAt: {
      type: Date,
      required: true,
    },
    licensePlates: {
      type: [String],
      required: true,
    },
    loyaltyPoints: {
      type: Number,
      required: true,
    },
  },
});
