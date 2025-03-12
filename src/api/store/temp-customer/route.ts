import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

export const GET = async (
  req: MedusaRequest<{customer_id: string}>,
  res: MedusaResponse
) => {
    const customerModuleService = req.scope.resolve(Modules.CUSTOMER)
    const customer = await customerModuleService.retrieveCustomer(req.body.customer_id);
    return res.status(200).json({firstName: customer.first_name, lastName: customer.last_name});
}