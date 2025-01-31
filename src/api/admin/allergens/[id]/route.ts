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
    fields: ["allergens.id", "allergens.name", "allergens.tooltip"],
  });

  console.log("data: ", JSON.stringify(data));
  

  return res.status(200).json(data)
}

export const PUT = async (
  req: MedusaRequest<PostAdminAllergenType>,
  res: MedusaResponse
) => {
  const productId = req.params.id;
  const selected_allergen_ids = req.body.selected_allergen_ids;

  const input: LinkAllergenWorkflowInputType = {
    selected_allergen_ids: selected_allergen_ids,
    product_id: productId,
  };
  
  if(!selected_allergen_ids || !productId){
    return res.status(400).json({"message": "wrong input"})
  }
  

  const { result } = await linkAllergensToProductWorkflow(req.scope).run({
    input: {
      selected_allergen_ids: selected_allergen_ids,
      product_id: productId
    },
  });

  return res.status(200)
};
