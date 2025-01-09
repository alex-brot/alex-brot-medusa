import { WeeklyOffer } from ".medusa/types/remote-query-entry-points";
import {
  createStep,
  StepResponse,
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { WEEKLY_OFFERS_MODULE } from "src/modules/weekly-offers-module";
import WeeklyOffersModuleService from "src/modules/weekly-offers-module/service";
import { IProductModuleService } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";
import { createRemoteLinkStep } from "@medusajs/medusa/core-flows";


export type CreateWeeklyOfferWorkflowInput = {
  title: string,
  from: Date,
  to: Date,
  selectedProductIds: string[]
};

export type CreateEmptyWeeklyOffer = {

}

//TODO: change this so it can use delete and maybe update??
//https://docs.medusajs.com/learn/customization/custom-features/workflow
//a workflow is a step and in this step you can make workflow?? 2. Create createBrandWorkflow 


export const creatWeeklyOfferStep = createStep(
  "create-weekly-offer-step",
  async (input: CreateWeeklyOfferWorkflowInput, { container }) => {
    const createEmptyWeeklyOfferInput: CreateEmptyWeeklyOffer = {
      title: input.title,
      from: input.from,
      to: input.to,
    };

    const weeklyOffersModuleService: WeeklyOffersModuleService =
      container.resolve(WEEKLY_OFFERS_MODULE);

    const weeklyOffer: WeeklyOffer =
      await weeklyOffersModuleService.createWeeklyOffers(createEmptyWeeklyOfferInput);

    return new StepResponse(weeklyOffer, weeklyOffer.id);
  }
);

export const createWeeklyOfferWorkflow = createWorkflow(
  "create-weekly-offer",
  (input: CreateWeeklyOfferWorkflowInput) => {


    const weeklyOffer = creatWeeklyOfferStep(input);

    const products = createStep(
      "retrieve-products",
      async (productIds: string[], { container }) => {
        const productModuleService: IProductModuleService = container.resolve(
          Modules.PRODUCT
        );
        const products = await productModuleService.listProducts({
          id: productIds,
        });
        return new StepResponse(products);
      }
    )(input.selectedProductIds);

    const links = products.map((product) => ({
      [WEEKLY_OFFERS_MODULE]: {
        weekly_offer_id: weeklyOffer.id
      },
      [Modules.PRODUCT]: {
        product_id: product.id,
      },
    }));

    createRemoteLinkStep(links);

    return new WorkflowResponse(weeklyOffer.id)
  })




