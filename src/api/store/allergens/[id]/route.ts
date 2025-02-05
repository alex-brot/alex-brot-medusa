import { LinkAllergenModuleAllergenProductProduct } from ".medusa/types/query-entry-points";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { linkAllergensToProductWorkflow, LinkAllergenWorkflowInputType } from "src/workflows/link-allergenes-to-product";
export type PostAdminAllergenType = {
  selected_allergen_ids: string[];
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const productId = req.params.id
  const query = req.scope.resolve("query")

  const { data } = await query.graph({
    entity: "product",
    filters: {
      id: productId
    },
    fields: ["allergens.name", "allergens.tooltip"],
  });

  console.log("data: ", JSON.stringify(data));
  

  return res.status(200).json(data)
}
