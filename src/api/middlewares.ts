import { validateAndTransformQuery } from "@medusajs/framework";
import { defineMiddlewares } from "@medusajs/medusa";
import { GetProductsParams } from "@medusajs/medusa/api/utils/common-validators/index";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";
import { z } from "zod";

export const getProductSchema = createFindParams()

export default defineMiddlewares({
  routes: [
    {
      method: "POST",
      matcher: "/admin/products/",
    },
    {
      matcher: "/admin/brands",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetProductsParams, {
          defaults: ["*"],
          isList: true,
        }),
      ],
    },
  ],
});
