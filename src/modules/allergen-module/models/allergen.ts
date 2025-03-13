import { model } from "@medusajs/framework/utils";

const Allergen = model.define("allergen", {
  id: model.id().primaryKey(),
  name: model.text(),
  tooltip: model.text(),
});

export default Allergen;