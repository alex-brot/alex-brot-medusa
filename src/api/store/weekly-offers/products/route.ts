import { MedusaRequest, MedusaResponse, Query } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve<Query>(ContainerRegistrationKeys.QUERY);
  const currentDate = new Date();

  // Query to get the current weekly offer
  const { data: weeklyOffers } = await query.graph({
    entity: "weekly_offer",
    fields: ["id", "title", "start", "end", "products.*"],
    filters: {
      start: {
        $lte: currentDate,
      },
      end: {
        $gte: currentDate,
      },
    },
  });

  if (weeklyOffers.length === 0) {
    return res.status(404).json({ message: "No current weekly offer found" });
  }

  return res.json(weeklyOffers.flatMap(offer => offer.products));
};