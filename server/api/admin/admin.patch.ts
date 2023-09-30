import { Admin } from "~/models/admin";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const result = Admin.findOneAndUpdate({ filter: {_id: body.id}, update: {name: body.name, password: body.password, email: body.email, phone: body.phone, role: body.role} });
    // Admin.createIndexes();
    return result;
  } catch (error) {
    return {
    status: 500,
    error: error,
    message: "Harap coba kembali"
  }
  }
});
