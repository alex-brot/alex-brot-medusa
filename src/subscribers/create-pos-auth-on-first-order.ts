import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {POS_MODULE} from "../modules/pos-module";
import PosService from "../modules/pos-module/service";

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger");

   const query = container.resolve(ContainerRegistrationKeys.QUERY);
  logger.info("getting customer data");
    const { data: orderData } = await query.graph({
        entity: "order",
        fields: ["customer_id"],
        filters: {
        id: data.id,
        },
    });

    if (!orderData[0].customer_id || orderData[0].customer_id === "" || orderData[0].customer_id.length === 0) {
        throw new Error("Could not find customer");
    }

    const posService: PosService = container.resolve(POS_MODULE);

    const orderCount = await posService.getCountSql({ customerId: orderData[0].customer_id });

    logger.info("order count: " + orderCount);

    if (orderCount > 1) {
        return;
    }

    logger.info("creating pos auth");

    await createPosAuthWorkflow(container).run({
        input: {
            customerId: orderData[0].customer_id,
        },
    });
}

export const config: SubscriberConfig = {
  event: `order.placed`,
};
