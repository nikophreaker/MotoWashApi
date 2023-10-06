import { User } from "~/models/users";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const result = User.findOneAndUpdate(
      { _id: body.id },
      {
        name: body.name,
        email: body.email,
        phone: body.phone,
        licensePlates: body.licensePlates.split(","),
        loyaltyPoints: Number(body.loyaltyPoints),
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
