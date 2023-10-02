import { User } from "~/models/users";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const result = new User({
      name: body.name,
      email: body.email,
      phone: body.phone,
      joinAt: new Date(),
      licensePlates: body.licensePlates.split(","),
      loyaltyPoints: Number(body.loyaltyPoints),
    });
    // Admin.createIndexes();
    try {
      return (await result.save()).errors != undefined
        ? {
            status: 500,
            error: (await result.save()).errors,
            message: "Harap coba kembali",
          }
        : result.save();
    } catch (error: any) {
      if (error.keyValue != undefined) {
        return {
          status: 500,
          error: error.keyValue,
          message: `${Object.keys(error.keyValue)} ${Object.values(
            error.keyValue
          )} sudah terdaftar`,
        };
      } else {
        return {
          status: 500,
          error: error,
          message: "Harap coba kembali",
        };
      }
    }
  } catch (error) {
    return {
      status: 500,
      error: error,
      message: "Harap coba kembali",
    };
  }
});
