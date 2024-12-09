import {
  Allergen,
  AllergensProduct,
  Product,
} from ".medusa/types/remote-query-entry-points";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { ALLERGEN_MODULE } from "src/modules/allergen-module";
import AllergenModuleService from "src/modules/allergen-module/service";

type CreateAllergeneProductWorkflowInput = {
  allergenes: Array<Allergen>;
};

export const createAllergeneProductStep = createStep(
  "create-allergene-product-step",
  async (data: CreateAllergeneProductWorkflowInput, { container }) => {
    if (!data.allergenes) {
      return;
    }

    const allergenModuleService: AllergenModuleService =
      container.resolve(ALLERGEN_MODULE);

    const productAllergenes: Product =
      await allergenModuleService.createAllergenProducts(data.allergenes);

    return new StepResponse(productAllergenes, "Allergene products created");
  }
);
