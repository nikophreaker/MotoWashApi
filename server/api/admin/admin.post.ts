import { Admin } from "~/models/admin";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const result = new Admin({
      name: body.name,
      password: body.password,
      email: body.email,
      phone: body.phone,
      role: body.role,
    });
    // Admin.createIndexes();
    try {
      return (await result.save()).errors != undefined
        ? createError({
            statusCode: 500,
            data: (await result.save()).errors,
            statusMessage: "Harap coba kembali",
          })
        : result.save();
    } catch (error: any) {
      if (error.keyValue != undefined) {
        return createError({
          statusCode: 402,
          data: error.keyValue,
          statusMessage: `${Object.keys(error.keyValue)} ${Object.values(
            error.keyValue
          )} sudah terdaftar`,
        });
      } else {
        return createError({
          statusCode: 500,
          data: error.errors,
          statusMessage: `${Object.values(error.errors)}`,
        });
      }
    }
  } catch (error) {
    return createError({
      statusCode: 500,
      data: error,
      statusMessage: "Harap coba kembali",
    });
  }
});
