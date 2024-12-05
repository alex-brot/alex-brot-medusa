import { MedusaService } from "@medusajs/framework/utils";
import AllergenProduct from "./models/allergen-product";


class AllergenModuleService extends MedusaService({
    AllergenProduct
}){

}

export default AllergenModuleService;