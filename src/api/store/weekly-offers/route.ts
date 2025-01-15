import { MedusaRequest, MedusaResponse, Query } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  QueryContext,
} from "@medusajs/framework/utils";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve<Query>(ContainerRegistrationKeys.QUERY);

  //at the moment only returns id
  const { data } = await query.graph({
    entity: "weekly_offer",
    fields: [
      "id",
      "title",
      "from",
      "to",
      "products.*",
      "products.variants.*",
      "products.variants.calculated_price.*",
    ],
    filters: {
      from: {
        $lte: new Date(),
      },
    },
    context: {
      products: {
        variants: {
          calculated_price: QueryContext({
            currency_code: "eur",
          }),
        },
      },
    },
  });

  return res.json(data);
};
