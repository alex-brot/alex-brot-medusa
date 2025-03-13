import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { UpdateShippingOptionDTO } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export const PATCH = async (
  req: MedusaRequest<{
    id: string;
    updatedShippingOption: UpdateShippingOptionDTO;
  }>,
  res: MedusaResponse
) => {
  const fulfillmentModuleService = req.scope.resolve(Modules.FULFILLMENT);

  if (!req.body.id) {
    return res.status(400).json({ message: "Missing id in body" });
  }

  const shippingOption = await fulfillmentModuleService.retrieveShippingOption(
    req.body.id
  );

  if (!shippingOption) {
    return res.status(404).json({ message: "Shipping option not found" });
  }

  const result = await fulfillmentModuleService.updateShippingOptions(
    shippingOption.id,
    req.body.updatedShippingOption
  );

  if (!result) {
    return res
      .status(400)
      .json({ message: "Failed to update shipping option" });
  }

  return res.status(201).json(result);
};
