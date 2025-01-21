import { z } from "zod";

export const PostAdminCreateWeeklyOffer = z.object({
  title: z.string(),
  from: z.date(),
  to: z.date(),
  selectedProductIds: z.string().array().nonempty()
});
