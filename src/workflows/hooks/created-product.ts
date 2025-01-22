import {ContainerRegistrationKeys} from "@medusajs/framework/utils";
import {StepResponse} from "@medusajs/framework/workflows-sdk";
import {createProductsWorkflow} from "@medusajs/medusa/core-flows";
import {Allergen} from "../../../.medusa/types/query-entry-points";
import {ALLERGEN_MODULE} from "../../modules/allergen-module";
import AllergenModuleService from "../../modules/allergen-module/service";

createProductsWorkflow.hooks.productsCreated(
    (async ({ products, additional_data }, { container }) => {
    if (!additional_data?.allergens) {
      return new StepResponse([], [])
    }

    const allergenModuleService: AllergenModuleService = container.resolve(ALLERGEN_MODULE)

    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

    try{
        for (const allergen of (additional_data.allergens as Allergen[])) {
            await allergenModuleService.retrieveAllergen(allergen.id)
        }
    }
    catch (error) {
        logger.info("Allergen not found")
    }
    
    // const remoteLink = container.resolve(
    //   ContainerRegistrationKeys.REMOTE_LINK
    // )
    

     const links = []

    // // link products to brands
    // for (const product of products) {
    //   links.push({
    //     [Modules.PRODUCT]: {
    //       product_id: product.id,
    //     },
    //     [ALLERGEN_MODULE]: {
    //       aller: allergen.id,
    //     },
    //   })
    // }

    // await remoteLink.create(links)

    // logger.info("Linked brand to products")

    return new StepResponse(links, links)
  })
)