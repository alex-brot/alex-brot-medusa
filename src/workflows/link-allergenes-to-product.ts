import { Modules } from "@medusajs/framework/utils";
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { ALLERGEN_MODULE } from "src/modules/allergen-module";
import productAllergen from "../links/allergen-product";
import { get } from "http";
import { log } from "console";

export type LinkAllergenWorkflowInputType = {
  selected_allergen_ids: string[];
  product_id: string;
};

//TODO: check if both exist else throw error
//TODO: find better way to toggle Allergens
export const linkAllergensStep = createStep(
  "link-allregenes-product-step",
  async (input: LinkAllergenWorkflowInputType, { container }) => {
    const remoteLinkService = container.resolve("remoteLink");
    const query = container.resolve("query");
    const logger = container.resolve("logger");

    const getAllLinks = async (productId: string) => {
      const { data: existingLinks } = await query.graph({
        entity: productAllergen.entryPoint,
        fields: ["allergen_id"],
        filters: {
          product_id: productId,
        },
      });

      return existingLinks;
    };

    const dismissAllLinks = async (allergenIds: string[], productId: string) => {
      for (const allergenId of allergenIds) {
        try {
          const response = await remoteLinkService.dismiss({
            [ALLERGEN_MODULE]: {
              allergen_id: allergenId,
            },
            [Modules.PRODUCT]: {
              product_id: productId,
            },
          });
          logger.info(response.toString());
        } catch (error) {
          return error;
        }
      }
    }
      

    const createLink = async (
      allergenId: string,
      productId: string,
    ) => {
      try {
        await remoteLinkService.create({
          [ALLERGEN_MODULE]: {
            allergen_id: allergenId,
          },
          [Modules.PRODUCT]: {
            product_id: productId,
          },
        });
      } catch (error) {
        return error;
      }

      return true;
    };

    const existingLinks = await getAllLinks(input.product_id)

    let ids = existingLinks.map((link) => link.allergen_id);
    const res = await dismissAllLinks(ids, input.product_id)

    logger.warn(res)

    for (const selectedProductId of input.selected_allergen_ids) {
      logger.info("createLink");
      await createLink(selectedProductId, input.product_id);
    }

    return new StepResponse(true);
  }
);

export const linkAllergensToProductWorkflow = createWorkflow(
  "link-allergens-product-workflow",
  (input: LinkAllergenWorkflowInputType) => {
    const creatingPosAuthStep = linkAllergensStep(input);
    return new WorkflowResponse(creatingPosAuthStep);
  }
);
