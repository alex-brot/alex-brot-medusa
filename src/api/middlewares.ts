import { defineMiddlewares } from "@medusajs/medusa";
import { createFindParams } from "@medusajs/medusa/api/utils/validators";

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
    },
    // {
    //   method: "PATCH",
    //   matcher: "/admin/shipping-options/",
    //   middlewares: []
    // }
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
