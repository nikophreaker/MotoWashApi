import { Admin } from "~/models/admin";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const result = new Admin({ name: body.name, password: body.password, email: body.email, phone: body.phone, role: body.role });
    // Admin.createIndexes();
    return result.save();
  } catch (error) {
    console.log(error);
  }
});
