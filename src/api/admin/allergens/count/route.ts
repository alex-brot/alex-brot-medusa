import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ALLERGEN_MODULE } from "src/modules/allergen-module";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const allergenService = req.scope.resolve(ALLERGEN_MODULE);

  const orderCount = await allergenService.getCountSql();

  return res.json({ count: orderCount });
};
