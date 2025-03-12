import { MedusaRequest, MedusaResponse, Query } from "@medusajs/framework";
import { CustomerDTO } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {createPosAuthWorkflow, CreatePosAuthWorkflowInput} from "../../../workflows/create-posauth";
import {addNfcWorkflow} from "../../../workflows/add-nfc-to-posauth";

export const POST = async (
  req: MedusaRequest<CreatePosAuthWorkflowInput>,
  res: MedusaResponse
) => {
  console.log(req.scope);
  console.log(req.body);

const { result } = await createPosAuthWorkflow(req.scope).run({
    input: {
      customerId: req.body.customerId,
    },
  });
  return res.status(201).json(result);
};

export const GET = async (req: MedusaRequest<CustomerDTO>, res: MedusaResponse) => {
  const query = req.scope.resolve<Query>(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph({
    entity: "pos_auth",
    fields: ["code", "nfcCode"],
    pagination: {
      skip: 0,
      order: {
        created_at: "desc",
      }
    }
  })
  return res.json(data)
}
export type PatchPosAuthType = {
  code: string;
  nfcCode: string;
};
export const PATCH = async (req: MedusaRequest<PatchPosAuthType>, res: MedusaResponse) => {
 
  const { result } = await addNfcWorkflow(req.scope).run({
    input: {
      code: req.body.code,
      nfcCode: req.body.nfcCode,
    },
  });
  return res.status(201).json(result);

}
