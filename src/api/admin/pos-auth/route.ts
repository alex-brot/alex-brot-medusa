import { MedusaRequest, MedusaResponse, Query } from "@medusajs/framework";
import { CustomerDTO } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { POS_MODULE } from "src/modules/pos-module";
import { createPosAuthWorkflow } from "src/workflows/create-posauth";

export const POST = async (req: MedusaRequest<CustomerDTO>, res: MedusaResponse) => {
  console.log(req.scope);
  console.log(req.body);

  const { result } = await createPosAuthWorkflow(req.scope).run({
    input: {
      customerId: req.body.id,
    }
  })
  return res.status(201).json(result)
};

export const GET = async (req: MedusaRequest<CustomerDTO>, res: MedusaResponse) => {
  const query = req.scope.resolve<Query>(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph({
    entity: "pos_auth",
    fields: ["id", "code", "nfc_code"],
    pagination: {
      skip: 0,
      order: {
        created_at: "desc",
      }
    }
  })
  return res.json(data)
}