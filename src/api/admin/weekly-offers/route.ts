import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import { IProductModuleService } from "@medusajs/framework/types";
import { z } from "zod";
import { PostAdminCreateWeeklyOffer } from "./validators";
import { GraphResultSet } from "@medusajs/types";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";
import { createWeeklyOfferWorkflow } from "src/workflows/create-weekly-offer";
import { log } from "console";

type PostAdminCreateWeeklyOfferType = z.infer<typeof PostAdminCreateWeeklyOffer>;

export const POST = async (req: MedusaRequest<PostAdminCreateWeeklyOfferType>, res: MedusaResponse) => {
  const productModuleService: IProductModuleService = req.scope.resolve(
    Modules.PRODUCT
  );

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


