import { MedusaRequest, MedusaResponse, Query } from "@medusajs/framework";
import {
  ContainerRegistrationKeys,
  QueryContext,
} from "@medusajs/framework/utils";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve<Query>(ContainerRegistrationKeys.QUERY);
  let fromDate = new Date(new Date().setHours(23, 59, 59, 999));
  let toDate = new Date(new Date().setHours(0, 0, 0, 0));

  console.log();

  //at the moment only returns id
  const { data } = await query.graph({
    entity: "weekly_offer",
    fields: [
      "id",
      "title",
      "start",
      "end",
      "products.*",
      "products.variants.*",
      "products.variants.calculated_price.*",
    ],
    filters: {
      start: {
        $lte: fromDate,
      },
      end: {
        $gte: toDate,
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
