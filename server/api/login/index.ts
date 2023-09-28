import { Admin } from "~/models/admin";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const result = await Admin.findOne({ email: body.email, password: body.password });
    return result;
  } catch (error) {
  }
})