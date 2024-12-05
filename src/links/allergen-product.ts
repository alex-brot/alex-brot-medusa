import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import allergenModule from "src/modules/allergen-module";
import AllergenModuleService from "src/modules/allergen-module/service";

export default defineLink(
  {
    linkable: allergenModule.linkable.allergensProduct,
    isList: true,
  },
  {
    linkable: ProductModule.linkable.product,
    isList: true,
  }
);
