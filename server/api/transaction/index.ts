import { Transaction } from "~/models/transactions";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    if (
      body.startDate != undefined &&
      body.endDate != undefined &&
      body.startDate != "" &&
      body.endDate != ""
    ) {
      const result = await Transaction.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "detail_user",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "detail_product",
          },
        },
        {
          $match: {
            transactionDate: {
              $gte: new Date(body.startDate),
              $lte: new Date(body.endDate),
            },
            $or: [
              {
                detail_user: {
                  $elemMatch: {
                    name: {
                      $regex: body.query,
                      $options: "i",
                    },
                  },
                },
              },
              {
                detail_product: {
                  $elemMatch: {
                    name: {
                      $regex: body.query,
                      $options: "i",
                    },
                  },
                },
              },
            ],
          },
        },
      ]);
      return result;
    }
    const result = await Transaction.aggregate([
      // {
      //   $addFields: {
      //     userId: { $toObjectId: "$userId" }
      //   },
      // },
      // {
      //   $addFields: {
      //     productId: { $map: {
      //       input: "$productId",
      //       as: "item",
      //       in: {
      //         $toObjectId: "$item"
      //       }
      //     } }
      //   }
      // },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "detail_user",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "detail_product",
        },
      },
      {
        $match: {
          $or: [
            {
              detail_user: {
                $elemMatch: {
                  name: {
                    $regex: body.query,
                    $options: "i",
                  },
                },
              },
            },
            {
              detail_product: {
                $elemMatch: {
                  name: {
                    $regex: body.query,
                    $options: "i",
                  },
                },
              },
            },
          ],
        },
      },
      // {
      //    $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$detail_user", 0 ] }, "$$ROOT" ] } }
      // },
      // { $project: { detail_transaction: 0 } }
    ]);
    return result;
  } catch (error) {
    return {
      status: 500,
      error: error,
      message: "Harap coba kembali",
    };
  }
});
