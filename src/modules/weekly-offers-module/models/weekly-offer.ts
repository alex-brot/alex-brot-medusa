import { model } from "@medusajs/framework/utils";
import { Product } from "@medusajs/medusa";

const WeeklyOffer = model.define("weekly_offer", {
    id: model.id().primaryKey(),
    name: model.text(),
    products: model.manyToMany(() => Product, {
        mappedBy: "products",
        pivotTable: "weekly_offer_product",
        joinColumn: "offer_id",
        inverseJoinColumn: "product_id",
    }),
});

export default WeeklyOffer;
