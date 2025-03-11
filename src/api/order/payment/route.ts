import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { RemoteQueryFunction } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  // Retrieve the posAuth code from the query parameters
  const posAuthCode = req.query.posAuthCode as string;
  if (!posAuthCode) {
    return res.status(400).json({ message: "Missing posAuth code" });
  }

  const type = req.query.type as "nfc" | "normal";
  if (!type) {
    return res.status(400).json({ message: "Missing type" });
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  if (type === "nfc") {
    // not supported yet
    // todo: implement this
    return res.status(400).json({ message: "Not supported yet" });
  } else {
    return handleNormalCode(query, posAuthCode, res);
  }
};

// async function handleNfcCode(
//   query: Omit<RemoteQueryFunction, symbol>,
//   posAuthCode: string
// ) {
//   const { data: customers } = await query.graph({
//     entity: "pos_auth",
//     fields: ["id"],
//     filters: {
//       // problem: nfcCode is undefined and string cant be assigned to undefined
//       nfcCode: posAuthCode,
//     },
//   });
// }

async function handleNormalCode(
  query: Omit<RemoteQueryFunction, symbol>,
  posAuthCode: string,
  res: MedusaResponse
) {

  const { data: customers } = await query.graph({
    entity: "pos_auth",
    fields: ["id"],
    filters: {
      code: posAuthCode,
    },
  });

  


  if (customers.length === 0) {
    return res.status(404).json({ message: "PosAuth not found" });
  }

  
  const {data: order} = await query.graph({
    entity: "order",
    fields: ["id", "customer_id"],
    filters: {
      customer_id: customers[0].id,
    },
  });

  console.log(order)

  
  return res.status(200).json({ message: "Payment successful", order });
  

}
