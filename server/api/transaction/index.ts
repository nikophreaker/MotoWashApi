import { Transaction } from "~/models/transactions";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    let date_today = new Date();
    let query = body ? body.query : "";
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
                      $regex: query,
                      $options: "i",
                    },
                  },
                },
              },
              {
                detail_product: {
                  $elemMatch: {
                    name: {
                      $regex: query,
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

    if (body.transaction != undefined && body.transaction != "") {
      if (body.transaction == "day") {
        const result = await Transaction.aggregate([
          {
            $match: {
              transactionDate: {
                $gte: new Date(
                  date_today.getFullYear(),
                  date_today.getMonth(),
                  1
                ),
                $lte: new Date(
                  date_today.getFullYear(),
                  date_today.getMonth() + 1,
                  0
                ),
              },
            },
          },
          {
            $group: {
              _id: {
                day: { $dayOfMonth: "$transactionDate" },
              },
              numberoftransactions: { $sum: 1 },
            },
          },
        ]);
        return result;
      } else if (body.transaction == "month") {
        const result = await Transaction.aggregate([
          {
            $match: {
              transactionDate: {
                $gte: new Date(date_today.getFullYear(), 0, 1),
                $lte: new Date(date_today.getFullYear(), 11, 31),
              },
            },
          },
          {
            $group: {
              _id: {
                month: { $month: "$transactionDate" },
              },
              numberoftransactions: { $sum: 1 },
            },
          },
        ]);
        return result;
      } else if (body.transaction == "year") {
        const result = await Transaction.aggregate([
          {
            $match: {
              transactionDate: {
                $gte: new Date(date_today.getFullYear() - 5, 0, 1),
                $lte: date_today,
              },
            },
          },
          {
            $group: {
              _id: {
                year: { $year: "$transactionDate" },
              },
              numberoftransactions: { $sum: 1 },
            },
          },
        ]);
        return result;
      } else {
        const result = await Transaction.aggregate([
          {
            $group: {
              _id: {
                day: { $dayOfMonth: "$transactionDate" },
                month: { $month: "$transactionDate" },
                year: { $year: "$transactionDate" },
              },
              numberoftransactions: { $sum: 1 },
            },
          },
        ]);
      }
    }

    if (body.chart != undefined && body.chart != "") {
      const result = await Transaction.aggregate([
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "detail_product",
          },
        },
        // {
        //   $match: {
        //     transactionDate: {
        //       $gte: new Date(
        //         date_today.getFullYear(),
        //         date_today.getMonth(),
        //         1
        //       ),
        //       $lte: new Date(
        //         date_today.getFullYear(),
        //         date_today.getMonth() + 1,
        //         0
        //       ),
        //     },
        //   },
        // },
        { $unwind: "$detail_product" },
        {
          $group: {
            _id: {
              productName: "$detail_product.name",
            },
            numberoftransactions: { $sum: 1 },
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
                    $regex: query,
                    $options: "i",
                  },
                },
              },
            },
            {
              detail_product: {
                $elemMatch: {
                  name: {
                    $regex: query,
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
