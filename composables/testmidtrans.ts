import axios from "axios";

export const useMidtrans = async () => {
  const clientAPI = (url: any) =>
    axios.create({
      baseURL: url,
      withCredentials: true,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: "",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers":
          "'Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token'",
      },
      data: JSON.stringify({
        payment_type: "qris",
        transaction_details: {
          order_id: "order_id-0123",
          gross_amount: 100000,
        },
        // qris: { acquirer: "gopay" },
      }),
    });
  const baseURL = "https://api.sandbox.midtrans.com/v2";
  const getCharge = await clientAPI(baseURL).post("/charge");
  return {
    getCharge,
  };
};
