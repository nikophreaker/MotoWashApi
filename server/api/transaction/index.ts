import { Transaction } from "~/models/transactions";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    // const result = await Transaction.find({ "$or": [
    //   {
    //     name: {
    //       $regex: body.query,
    //       $options: "i"
    //     },
    //     email: {
    //       $regex: body.query,
    //       $options: "i"
    //     },
    //     phone: {
    //       $regex: body.query,
    //       $options: "i"
    //     },
    //     licensePlates: {
    //       $regex: body.query,
    //       $options: "i"
    //     }
    //   }
    // ] })//.skip(body.skip).limit(body.limit);
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
        $lookup : {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "detail_user",
        }
      },
      {
        $lookup : {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "detail_product",
        }
      },
      {
        $match : { $or: [
              // {
              //   paymentMethod: {
              //   $regex: body.query,
              //   $options: "i"
              //   }
              // },
              // {
              //   paymentStatus: {
              //   $regex: body.query,
              //   $options: "i"
              //   }
              // },
              // {
              //   totalAmount: {
              //   $regex: body.query,
              //   $options: "i"
              //   }
              // },
              {
                detail_user: {
                  $elemMatch: {
                    name: {
                      $regex: body.query,
                      $options: "i"
                    }
                  }
                }
              },
              // {
              //   detail_user: {
              //     $elemMatch : {
              //       _id: "userId",
              //       name: {
              //         $regex: body.query,
              //         $options: "i"
              //       }
              //     }
              //   }
              // },
              
          ] 
        }
      },
      // {
      //    $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$detail_user", 0 ] }, "$$ROOT" ] } }
      // },
      // { $project: { detail_transaction: 0 } }
    ])
    return result;
  } catch (error) {
    return {
      status: 500,
      error: error,
      message: "Harap coba kembali"
    };
  }
})