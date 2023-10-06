import { Admin } from "~/models/admin";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const result = Admin.findOneAndUpdate(
      { _id: body.id },
      {
        name: body.name,
        password: body.password,
        email: body.email,
        phone: body.phone,
        role: body.role,
      }
    );
    // Admin.createIndexes();
    const res = result
      .then((res) => {
        return res?.errors != undefined
          ? createError({
              statusCode: 500,
              data: res?.errors,
              statusMessage: "Harap coba kembali",
            })
          : res;
      })
      .catch((err) => {
        if (err.keyValue != undefined) {
          return createError({
            statusCode: 402,
            data: err.keyValue,
            statusMessage: `${Object.keys(err.keyValue)} ${Object.values(
              err.keyValue
            )} sudah terdaftar`,
          });
        } else {
          return createError({
            statusCode: 500,
            data: err.errors,
            statusMessage: `${Object.values(err.errors)}`,
          });
        }
      });
    return res;
  } catch (error) {
    return createError({
      statusCode: 500,
      data: error,
      statusMessage: "Harap coba kembali",
    });
  }
});
