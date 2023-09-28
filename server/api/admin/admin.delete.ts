import { Admin } from "~/models/admin";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const result = await Admin.findOneAndDelete({_id: body.id});
    return result;
  } catch (error) {
    console.log(error);
  }
});
