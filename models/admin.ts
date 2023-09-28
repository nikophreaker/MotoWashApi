import { defineMongooseModel } from "#nuxt/mongoose";

export const Admin = defineMongooseModel({
  name: "Admin",
  schema: {
    name: {
      type: String,
      required: true,
      index: "text"
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      index: "text"
    },
    phone: {
      type: String,
      unique: true,
      required: true,
      index: "text"
    },
    role: {
      type: String,
      required: true,
      index: "text"
    },
  },
});
