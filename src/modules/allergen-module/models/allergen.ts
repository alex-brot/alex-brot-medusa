import { model } from "@medusajs/framework/utils";
import AllergenProduct from "./allergen-product";

const Allergen = model.define("allergen", {
  id: model.id().primaryKey(),
  name: model.text(),
  products: model.manyToMany(() => AllergenProduct, {
    mappedBy: "allergens",
    pivotTable: "allergen_product",
    joinColumn: "allergen_id",
    inverseJoinColumn: "product_id",
  }),
});

export default Allergen;