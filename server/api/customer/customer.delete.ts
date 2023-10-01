import { User } from "~/models/users";


export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const result = await User.findOneAndDelete({_id: body.id});
    return result;
  } catch (error) {
    return {
    status: 500,
    error: error,
    message: "Harap coba kembali"
  }
  }
});
