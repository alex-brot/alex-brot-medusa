import { model } from "@medusajs/framework/utils";
import Allergen from "./allergen";


const AllergenProduct = model.define("allergens_product", {
  id: model.id().primaryKey(),
  allergens: model.manyToMany(() => Allergen, {
    mappedBy: "products",
  }),
});
export default AllergenProduct;
