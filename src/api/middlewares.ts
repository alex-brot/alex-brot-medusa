import { defineMiddlewares } from "@medusajs/medusa";
import { z } from "zod";

export default defineMiddlewares({
  routes: [
    {
      method: "POST",
      matcher: "/admin/products/",
    },
  ],
});
