import {
    createStep,
    createWorkflow,
    StepResponse,
    transform,
    WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {ProductDTO} from "@medusajs/framework/types";
import {Modules} from "@medusajs/framework/utils";
import {getProductsStep,} from "@medusajs/medusa/core-flows";
import WeeklyOffersModuleService from "../modules/weekly-offers-module/service";
import {WEEKLY_OFFERS_MODULE} from "../modules/weekly-offers-module";
import {WeeklyOffer} from "../../.medusa/types/query-entry-points";

export type CreateWeeklyOfferWorkflowInput = {
  title: string;
  from: Date;
  to: Date;
  selectedProductIds: string[];
};

export type CreateEmptyWeeklyOffer = {};

//TODO: change this so it can use delete and maybe update??
//https://docs.medusajs.com/learn/customization/custom-features/workflow
//a workflow is a step and in this step you can make workflow?? 2. Create createBrandWorkflow

export const creatWeeklyOfferStep = createStep(
  "create-weekly-offer-step",
  async (input: CreateWeeklyOfferWorkflowInput, { container }) => {
    console.log("input in step", input);

    const createEmptyWeeklyOfferInput: CreateEmptyWeeklyOffer = {
      title: input.title,
      from: input.from,
      to: input.to,
    };

    const weeklyOffersModuleService: WeeklyOffersModuleService =
      container.resolve(WEEKLY_OFFERS_MODULE);

    const weeklyOffer: WeeklyOffer =
      await weeklyOffersModuleService.createWeeklyOffers(
        createEmptyWeeklyOfferInput
      );

    const remoteLinkService = container.resolve("remoteLink");

    const createLinks = async (productId: string, weeklyOffer: WeeklyOffer) => {
      try {
        await remoteLinkService.create({
          [WEEKLY_OFFERS_MODULE]: {
            weekly_offer_id: weeklyOffer.id,
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

    console.log(input.selectedProductIds);

    for (const selectedProductId of input.selectedProductIds) {
      console.log(selectedProductId);

      createLinks(selectedProductId, weeklyOffer)
        .then((weekly_offer_id) => {
          console.log("Weekly Offer ID:", weekly_offer_id);
        })
        .catch((error) => {
          console.error("Error creating weekly offer:", error);
        });
    }

    return new StepResponse(weeklyOffer, weeklyOffer.id);
  }
);

export const createWeeklyOfferWorkflow = createWorkflow(
  "create-weekly-offer",
  (input: CreateWeeklyOfferWorkflowInput) => {
    const weeklyOffer = creatWeeklyOfferStep(input);

    // const products = createStep(
    //   "retrieve-products",
    //   async (productIds: string[], { container }) => {
    //     const productModuleService: IProductModuleService = container.resolve(
    //       Modules.PRODUCT
    //     );
    //     const products = await productModuleService.listProducts({
    //       id: productIds,
    //     });
    //     return new StepResponse(products);
    //   }
    // )(input.selectedProductIds);

    // Inside your workflow function
    const productsStep = getProductsStep({
      ids: input.selectedProductIds, // Replace with your actual product IDs
    });

    // Inside your workflow function
    // Now we need to handle each item in the array

    const result: { id: string; title: string }[] = transform(
      { productsStep },
      ({ productsStep }) => {
        const products = productsStep.filter(
          (item): item is ProductDTO => "id" in item
        );

        // Now you can work with the products
        const processedProducts = products.map((product) => {
          console.log(product);

          // Do something with each product
          return {
            id: product.id,
            title: product.title,
            // Add more processing as needed
          };
        });

        return processedProducts;
      }
    );

    //  const links = transform(
    //    {
    //      result,
    //      input,
    //    },
    //    (data) =>
    //      data.result.map((product) => ({
    //        [WEEKLY_OFFERS_MODULE]: {
    //          weekly_offer_id: weeklyOffer.id,
    //        },
    //        [Modules.PRODUCT]: {
    //          product_id: product.id,
    //        },
    //      }))
    //  );

    //  createRemoteLinkStep(links)
    // transform({
    //   result,
    //   weeklyOffer
    // },
    // (data) => {
    //     when(data, (data) => data.result !== undefined).then(() => {
    //       for (const product of data.result) {
    //         createRemoteLinkStep({
    //           [Modules.PRODUCT]: {
    //             product_id: product.id,
    //           },
    //           "WeeklyOfferService": {
    //             weekly_offer_id: weeklyOffer.id,
    //           },
    //         });
    //       }
    //     });
    // });

    return new WorkflowResponse({ weeklyOffer });
  }
);
