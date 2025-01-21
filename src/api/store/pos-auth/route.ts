import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { ICustomerModuleService } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { log } from "console";
import { POS_MODULE } from "src/modules/pos-module";

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  if (!req.auth_context || req.auth_context === undefined) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const customerModuleService: ICustomerModuleService = req.scope.resolve(
    Modules.CUSTOMER
  );

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const {data: posAuth} = await query.graph({
    entity: "customer",
    fields: ["pos_auth.code", "pos_auth.nfc_code"],
    filters: {
      id: req.auth_context.actor_id,
    },
  })

  log(posAuth);
  return res.json(posAuth[0].pos_auth);
};
