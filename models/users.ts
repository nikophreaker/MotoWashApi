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
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      unique: true,
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
