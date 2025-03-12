import {
  authenticate,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework";
import { defineMiddlewares } from "@medusajs/medusa";
import {
  GetProductsParams,
  StoreGetProductParamsDirectFields,
} from "@medusajs/medusa/api/utils/common-validators/index";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";
import { z } from "zod";
import { PostAdminCreateWeeklyOffer } from "./admin/weekly-offers/validators";
import { AdminGetProductsParams } from "@medusajs/medusa/api/admin/products/validators";

export const getProductSchema = createFindParams();

export default defineMiddlewares({
  routes: [
    {
      method: "POST",
      matcher: "/admin/products/",
    },
    {
      method: "GET",
      matcher: "/admin/customer-management",
    }
    // {
    //   matcher: "/store/pos-auth*",
    //   middlewares: [authenticate("customer", ["session", "bearer"])],
    // },
    // {
    //   matcher: "/admin/weekly-offers",
    //   method: "POST",
    //   //TODO: fix validator
    //   //middlewares: [validateAndTransformBody(PostAdminCreateWeeklyOffer as any)],
    // },
  ],
});
