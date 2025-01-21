import { defineLink } from "@medusajs/framework/utils";
import CustomerModule from "@medusajs/medusa/customer";
import ProductModule from "@medusajs/medusa/product";
import allergenModule from "src/modules/allergen-module";
import posModule from "src/modules/pos-module";

export default defineLink(
  {
    linkable: posModule.linkable.posAuth,
  },
  {
    linkable: CustomerModule.linkable.customer,
  }
);
