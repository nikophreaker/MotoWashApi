import { User } from "~/models/users";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    let query = body ? body.query : "";
    const result = await User.find({
      $or: [
        {
          name: {
            $regex: query,
            $options: "i",
          },
          email: {
            $regex: query,
            $options: "i",
          },
          phone: {
            $regex: query,
            $options: "i",
          },
          licensePlates: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    });
    // .skip(body.skip)
    // .limit(body.limit);

    //News Data if want pagination
    // const result = await User.aggregate([
    //   {
    //     $facet: {
    //       data: [
    //         // {
    //         //   $match: {
    //         //     $or: [
    //         //       {
    //         //         data: {
    //         //           $elemMatch: {
    //         //             name: {
    //         //               $regex: body.query,
    //         //               $options: "i",
    //         //             },
    //         //             email: {
    //         //               $regex: body.query,
    //         //               $options: "i",
    //         //             },
    //         //             phone: {
    //         //               $regex: body.query,
    //         //               $options: "i",
    //         //             },
    //         //             licensePlates: {
    //         //               $regex: body.query,
    //         //               $options: "i",
    //         //             },
    //         //           },
    //         //         },
    //         //       },
    //         //     ],
    //         //   },
    //         // },
    //         {
    //           $match: {
    //             $or: [
    //               {
    //                 name: {
    //                   $regex: body.query,
    //                   $options: "i",
    //                 },
    //               },
    //               {
    //                 email: {
    //                   $regex: body.query,
    //                   $options: "i",
    //                 },
    //               },
    //               {
    //                 phone: {
    //                   $regex: body.query,
    //                   $options: "i",
    //                 },
    //               },
    //               {
    //                 licensePlates: {
    //                   $elemMatch: {
    //                     $regex: body.query,
    //                     $options: "i",
    //                   },
    //                 },
    //               },
    //             ],
    //           },
    //         },
    //         // { $skip: 0 },
    //         // { $limit: 10 },
    //       ],
    //       totalCount: [
    //         {
    //           $count: "total_data",
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       data: 1,
    //       totalData: {
    //         $let: {
    //           vars: {
    //             elem: {
    //               $arrayElemAt: ["$totalCount", 0],
    //             },
    //           },
    //           in: {
    //             $trunc: "$$elem.total_data",
    //           },
    //         },
    //       },
    //     },
    //   },
    //   // { $unwind: "$paginatedResults" },
    //   // { $unwind: { path: "$totalCount" } },
    //   // {
    //   //   $replaceRoot: {
    //   //     newRoot: {
    //   //       $mergeObjects: [{ $mergeObject: "$paginatedResults" }, "$$ROOT"],
    //   //     },
    //   //   },
    //   // },
    // ]);

    return result;
  } catch (error) {
    return {
      status: 500,
      error: error,
      message: "Harap coba kembali",
    };
  }
});
