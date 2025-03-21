import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import allergenModule from "../modules/allergen-module";

export default defineLink(
  {
    linkable: allergenModule.linkable.allergen,
    isList: true,
  },
  {
    linkable: ProductModule.linkable.product,
    isList: true,
  }
);
