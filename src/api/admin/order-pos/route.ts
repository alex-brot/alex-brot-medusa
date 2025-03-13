import { Payment } from ".medusa/types/query-entry-points";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { RemoteQueryFunction } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  capturePaymentWorkflow,
  createOrderFulfillmentWorkflow,
  markOrderFulfillmentAsDeliveredWorkflow,
} from "@medusajs/medusa/core-flows";

/** some notes:
 * when a payment is captured, order.transaction is updated with the payment details
 * when a order is fulfilled, order.fulfillment is updated with the fulfillment details
 */

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const orderId = req.query.orderId as string | undefined;

  if (!orderId) {
    return res.status(400).json({ message: "Missing orderId" });
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: orders } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "customer.*",
      "status",
      "payment_collections.id",
      "payment_collections.payments.id",
      "items.*",
    ],
    filters: {
      id: orderId,
    },
  });

  if (!orders || orders.length === 0) {
    return res.status(404).json({ message: "Order not found" });
  }

  const order = orders[0];

  const payment_collection = order.payment_collections?.[0];
  if (!payment_collection) {
    return res.status(404).json({ message: "Payment collection not found" });
  }

  const paymentId = (payment_collection as any).payments[0].id as string;

  if (!paymentId) {
    return res.status(404).json({ message: "Payment not found" });
  }

  try {
    // Capture the payment using the capturePaymentWorkflow
    const { result: capturedPayment } = await capturePaymentWorkflow(
      req.scope
    ).run({
      input: {
        payment_id: paymentId,
      },
    });
    try {
      // Prepare fulfillment items based on order items
      if (!order.items || order.items.length === 0) {
        return res.status(404).json({ message: "Order items not found" });
      }
      const fulfillmentItems = order.items.map((item: any) => ({
        id: item.id,
        quantity: item.quantity,
      }));

      // Create the fulfillment using the createOrderFulfillmentWorkflow

      console.log(fulfillmentItems);

      const { result: fulfillmentResult } =
        await createOrderFulfillmentWorkflow(req.scope).run({
          input: {
            order_id: orderId,
            items: fulfillmentItems,
          },
        });
      try {
        // Mark the fulfillment as delivered using the markOrderFulfillmentAsDeliveredWorkflow
        const { result: deliveredFulfillment } =
          await markOrderFulfillmentAsDeliveredWorkflow(req.scope).run({
            input: {
              orderId: orderId,
              fulfillmentId: fulfillmentResult.id,
            },
          });

        return res.status(200).json({
          order,
          capturedPayment,
          fulfillment: fulfillmentResult,
          deliveredFulfillment,
        });
      } catch (error) {
        return res
          .status(500)
          .json({ message: `Fulfillment delivery failed: ${error.message}` });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: `Fulfillment creation failed: ${error.message}` });
    }
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: `Payment capture failed: ${error.message}` });
  }

  // return res.status(200).json({ orders });
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  // Retrieve the posAuth code from the query parameters
  const posAuthCode = req.query.posAuthCode as string;
  if (!posAuthCode) {
    return res.status(400).json({ message: "Missing posAuth code" });
  }

  const type = req.query.type as "nfc" | "normal";
  if (!type) {
    return res.status(400).json({ message: "Missing type" });
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  if (type === "nfc") {
    // not supported yet
    // todo: implement this
    return res.status(400).json({ message: "Not supported yet" });
  } else {
    return handleNormalCode(query, posAuthCode, res);
  }
};

// async function handleNfcCode(
//   query: Omit<RemoteQueryFunction, symbol>,
//   posAuthCode: string
// ) {
//   const { data: customers } = await query.graph({
//     entity: "pos_auth",
//     fields: ["id"],
//     filters: {
//       // problem: nfcCode is undefined and string cant be assigned to undefined
//       nfcCode: posAuthCode,
//     },
//   });
// }

async function handleNormalCode(
  query: Omit<RemoteQueryFunction, symbol>,
  posAuthCode: string,
  res: MedusaResponse
) {
  const { data: pos_auth } = await query.graph({
    entity: "pos_auth",
    fields: [
      "id",
      "customer.*",
      "customer.orders.status",

      "customer.orders.items.*",
      // "customer.orders.items.unit_price",
      // "customer.orders.items.thumbnail",
      // "customer.orders.items.product_title",
      // "customer.orders.items.title",
      "customer.orders.fulfillments.*",
      "customer.orders.transactions.*",
    ],
    filters: {
      code: posAuthCode,
      customer: {
        orders: {
          status: {
            $ne: "canceled" as any,
          },
        },
      } as any,
    },
  });

  if (!pos_auth) {
    return res.status(404).json({ message: "PosAuth not found" });
  }

  const customer = pos_auth[0].customer;

  if (!customer || !customer.orders) {
    return res.status(404).json({ message: "Customer or orders not found" });
  }

  // Transform each order to match your Kotlin data class structure.
  const orders = customer.orders
    .map((order) => {
      if (!order || !order.items) {
        return;
      }
      if (order.fulfillments && order.fulfillments.length !== 0) {
        return;
      }

      if (order.transactions && order.transactions.length !== 0) {
        return;
      }
      if (order.status === "canceled") {
        return;
      }
      const total = order.items.reduce((sum, item) => {
        if (!item) {
          return sum;
        }
        // Multiply the unit price (assuming a number) by the quantity
        return sum + item.unit_price * item.quantity;
      }, 0);

      // Create a map from OrderItem to quantity.
      // Note: Since JSON object keys must be strings,
      // we use JSON.stringify for the key.
      const itemsArray = order.items.map((item) => {
        if (!item) {
          return;
        }
        const orderItem = {
          imageUrl: item.thumbnail || "", // Use thumbnail as imageUrl (default to empty if null)
          name: item.product_title || item.title || "", // Use product_title (or fallback to title)
          unitPrice: item.unit_price,
        };
        return [orderItem, item.quantity];
      });

      return {
        id: order.id,
        total: total,
        items: itemsArray,
        // transactions: order.transactions,
        // fulfilments: order.fulfillments,
      };
    })
    .filter((order) => order !== null && order !== undefined);

  // Return the transformed orders.
  return res.status(200).json(orders);
}
