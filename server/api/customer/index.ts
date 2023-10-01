import { User } from "~/models/users";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const result = await User.find({ "$or": [
      {
        name: {
          $regex: body.query,
          $options: "i"
        },
        email: {
          $regex: body.query,
          $options: "i"
        },
        phone: {
          $regex: body.query,
          $options: "i"
        },
        licensePlates: {
          $regex: body.query,
          $options: "i"
        }
      }
    ] })//.skip(body.skip).limit(body.limit);
    return result;
  } catch (error) {
    return {
      status: 500,
      error: error,
      message: "Harap coba kembali"
    };
  }
})