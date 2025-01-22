import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import {Allergen, Product} from "../../../../.medusa/types/query-entry-points";
import AllergenModuleService from "../../../modules/allergen-module/service";
import {ALLERGEN_MODULE} from "../../../modules/allergen-module";

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
