import { defineLink } from "@medusajs/framework/utils";
import ProductModule from "@medusajs/medusa/product";
import weeklyOffersModule from "src/modules/weekly-offers-module";

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
