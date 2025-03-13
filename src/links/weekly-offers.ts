import { defineLink } from "@medusajs/framework/utils";
import weeklyOffersModule from "../modules/weekly-offers-module";
import ProductModule from "@medusajs/medusa/product";

export default defineLink(
  {
    linkable: weeklyOffersModule.linkable.weeklyOffer,
    isList: true,
  },
  {
    linkable: ProductModule.linkable.product,
    isList: true,
  }
);
