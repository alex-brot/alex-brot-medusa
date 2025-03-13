import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { CustomerDTO } from "@medusajs/framework/types";
import { updateCustomersWorkflow } from "@medusajs/medusa/core-flows";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve("query");
  const logger = req.scope.resolve("logger");
  logger.info("Getting unverified customers");
  const unverifiedCustomers = await query.graph({
    entity: "customer",
    fields: ["*"],
    filters: {
      $or: [{ metadata: { isVerified: false } }, { metadata: null }],
    } as any
  });
  return res.status(200).json(unverifiedCustomers);
}

export async function PATCH(
  req: MedusaRequest<{ customer_Id: string }>,
  res: MedusaResponse
) {
  let updatedCustomer: CustomerDTO | null = null;
  const logger = req.scope.resolve("logger");
  try {
    const query = req.scope.resolve("query");
    const customerService = req.scope.resolve("customer");
    logger.info(`Verifying customer with id: ${req.body.customer_Id}`);
    const customer = await customerService.retrieveCustomer(
      req.body.customer_Id
    );

    logger.info(customer ? "Customer found" : "Customer not found");

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    // if (customer.metadata.isVerified) {
    //   return res.status(404).json({ error: "Customer is already verified" });
    // }

    logger.info(
      `updating customer ${customer.first_name} ${customer.last_name}`
    );

    await updateCustomersWorkflow(req.scope)
      .run({
        input: {
          selector: {
            id: [customer.id],
          },
          update: {
            metadata: {
              ...customer.metadata,
              isVerified: true,
            },
          },
          additional_data: {},
        },
      })
      .then((result) => {
        updatedCustomer = result.result[0];

        logger.info(`Customer with id: ${req.body.customer_Id} verified`);

        if (!updatedCustomer) {
          return res.status(500).json({ error: "Error verifying customer" });
        }

        logger.info(
          updatedCustomer.metadata.isVerified
            ? "Customer verified"
            : "Customer not verified"
        );
        return res.status(200).json(updatedCustomer);
      });
  } catch (error) {
    return res.json({ error: "Error verifying customer" });
  }
  if (!updatedCustomer) {
    return res.status(500).json({ error: "Error verifying customer" });
  }
  return res.json(updatedCustomer);
}
