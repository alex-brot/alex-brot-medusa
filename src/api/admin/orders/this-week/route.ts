import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Query } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve<Query>(ContainerRegistrationKeys.QUERY);
  const currentDate = new Date();

  const { data: weeklyOffers } = await query.graph({
    entity: "weekly_offer",
    fields: ["start", "end"],
    filters: {
      start: {
        $lte: currentDate,
      },
      end: {
        $gte: currentDate,
      },
    },
  });

  const { data } = await query.graph({
    entity: "order_items",
    fields: ["item.product.*", "quantity"],
    pagination: {
      skip: 0,
      take: 20,
    },
    filters: {
      $and: [
        {
          created_at: {
            $gte: new Date(
              Math.min(...weeklyOffers.map((o) => new Date(o.start).getTime()))
            ),
          },
        },
        {
          created_at: {
            $lte: new Date(
              Math.max(...weeklyOffers.map((o) => new Date(o.end).getTime()))
            ),
          },
        },
      ],
    } as any
  });

  return res.json(data);
};
