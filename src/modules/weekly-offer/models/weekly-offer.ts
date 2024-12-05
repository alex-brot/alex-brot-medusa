import { model } from "@medusajs/framework/utils";

// TODO: after linking product model with allergens, create a many to many relationship between weekly-offer and products
// const WeeklyOffer = model.define("weekly-offer", {
//     id: model.id().primaryKey(),
//     products: model.manyToMany(() => Product, {
//     mappedBy: "orders",
//     pivotTable: "order_product",
//     joinColumn: "order_id",
//     inverseJoinColumn: "product_id"
//   }),

// )