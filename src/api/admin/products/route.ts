import {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve("query")
  
  const {
    data: products,
  } = await query.graph({
    entity: "product",
    fields: ["*"],
  });

  res.json({ products })
}