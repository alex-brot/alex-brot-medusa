import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";
import { IProductModuleService } from "@medusajs/framework/types";
import { z } from "zod";
import { PostAdminCreateWeeklyOffer } from "./validators";
import { GraphResultSet } from "@medusajs/types";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";
import { createWeeklyOfferWorkflow } from "src/workflows/create-weekly-offer";

type PostAdminCreateBrandType = z.infer<typeof PostAdminCreateWeeklyOffer>;

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const productModuleService: IProductModuleService = req.scope.resolve(
    Modules.PRODUCT
  );

  //TODO: fix validator and remove this sh*t

  const { title, from, to, selectedProductIds } = req.validatedBody as {
    title: string;
    from: Date;
    to: Date;
    selectedProductIds: string[];
  };

  const input = {title: title, from: from, to: to, selectedProductIds: selectedProductIds}

  //at the moment only returns id
  const { result } = await createWeeklyOfferWorkflow(req.scope)
    .run()

  return res.status(201).json(result)
};


