import { validateAndTransformBody, validateAndTransformQuery } from "@medusajs/framework";
import { defineMiddlewares } from "@medusajs/medusa";
import { GetProductsParams } from "@medusajs/medusa/api/utils/common-validators/index";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";
import { z } from "zod";
import { PostAdminCreateWeeklyOffer } from "./admin/weekly-offers/validators";

export const getProductSchema = createFindParams()

export default defineMiddlewares({
  routes: [
    {
      method: "POST",
      matcher: "/admin/products/",
    },
    {
      matcher: "/admin/products",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetProductsParams, {
          defaults: ["*"],
          isList: true,
        }),
      ],
    },
    {
      matcher: "/admin/brands",
      method: "POST",
      //TODO: fix validator
      //middlewares: [validateAndTransformBody(PostAdminCreateWeeklyOffer as any)],
    },
  ],
});
