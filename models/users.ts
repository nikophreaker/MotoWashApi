import { defineMongooseModel } from "#nuxt/mongoose";

export const User = defineMongooseModel({
  name: "User",
  schema: {
    name: {
      type: String,
      required: true,
      index: "text"
    },
    email: {
      type: String,
      unique: true,
      required: true,
      index: "text"
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      index: "text"
    },
    licensePlates: {
      type: [String],
      required: true,
      index: "text"
    },
  },
});
