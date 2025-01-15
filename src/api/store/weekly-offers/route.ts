import { MedusaRequest, MedusaResponse, Query } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve<Query>(ContainerRegistrationKeys.QUERY)

  //at the moment only returns id
  const { data } = await query.graph({
    entity: "weekly_offer",
    fields: ["id", "title", "from", "to", "products.*", ],
    filters:{
        from: {
            $lte: new Date()
        },
    }
  })

  return res.json(data)
}
