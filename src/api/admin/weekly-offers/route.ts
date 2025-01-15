import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { z } from "zod";
import { PostAdminCreateWeeklyOffer } from "./validators";
import { createWeeklyOfferWorkflow } from "src/workflows/create-weekly-offer";
import { Query } from "@medusajs/framework";

type PostAdminCreateWeeklyOfferType = z.infer<typeof PostAdminCreateWeeklyOffer>;

export const POST = async (req: MedusaRequest<PostAdminCreateWeeklyOfferType>, res: MedusaResponse) => {
  console.log(req.scope);
  console.log(req.body);


  //at the moment only returns id
  const { result } = await createWeeklyOfferWorkflow(req.scope)
    .run({
        input: req.body
    })

    console.log(result);


  return res.status(201).json(result)
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve<Query>(ContainerRegistrationKeys.QUERY)

  //at the moment only returns id
  const { data } = await query.graph({
    entity: "weekly_offer",
    fields: ["id", "title", "from", "to", "products.*"]
  })

  return res.json(data)
}
