import { Admin } from "~/models/admin";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const result = await Admin.find({ "$or": [
      {
        name: {
          $regex: body.q,
          $options: "i"
        },
        email: {
          $regex: body.q,
          $options: "i"
        },
        phone: {
          $regex: body.q,
          $options: "i"
        },
        role: {
          $regex: body.q,
          $options: "i"
        }
      }
    ] }).skip(body.offset).limit(body.limit);
    return result;
  } catch (error) {
  }
})