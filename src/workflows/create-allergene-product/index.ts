import {
  Allergen,
  AllergensProduct,
} from ".medusa/types/remote-query-entry-points";
import { ProductDTO } from "@medusajs/framework/types";
import { createWorkflow, transform, when, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { createAllergeneProductStep } from "./steps/create-allergene-product";
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows";
import { Modules } from "@medusajs/framework/utils";
import { ALLERGEN_MODULE } from "src/modules/allergen-module";

export type CreateAllergenProductWorkflowInput = {
  product: ProductDTO;
  additional_data?: {
    allergens: Array<Allergen>;
  };
};

export const createCustomFromProductWorkflow = createWorkflow(
  "create-allergen-product-from-product",
  (input: CreateAllergenProductWorkflowInput) => {
    const allergens = transform(
      {
        input,
      },
      (data) => data.input.additional_data?.allergens || []
    );

    const allergenProduct = createAllergeneProductStep({
      allergenes: allergens,
    });

    when(
      { allergenProduct },
      ({ allergenProduct }) => allergenProduct !== undefined
    ).then(() => {
      createRemoteLinkStep([
        {
          [Modules.PRODUCT]: {
            product_id: input.product.id,
          },
          [ALLERGEN_MODULE]: {
            allergen_id: allergenProduct.id,
          },
        },
      ]);
    });

    return new WorkflowResponse({
      allergenProduct,
    });
  }
);


