import { MedusaService } from "@medusajs/framework/utils";
import AllergenProduct from "./models/allergen-product";
import Allergen from "./models/allergen";

class AllergenModuleService extends MedusaService({
  Allergen,
  AllergenProduct,
}) {}

export default AllergenModuleService;
