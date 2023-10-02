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
          ? {
              status: 500,
              error: res?.errors,
              message: "Harap coba kembali",
            }
          : res;
      })
      .catch((err) => {
        if (err.keyValue != undefined) {
          return {
            status: 500,
            error: err.keyValue,
            message: `${Object.keys(err.keyValue)} ${Object.values(
              err.keyValue
            )} sudah terdaftar`,
          };
        } else {
          return {
            status: 500,
            error: err,
            message: "Harap coba kembali",
          };
        }
      });
    return res;
  } catch (error) {
    return {
      status: 500,
      error: error,
      message: "Harap coba kembali",
    };
  }
});
