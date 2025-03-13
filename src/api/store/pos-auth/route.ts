import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { log } from "console";

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  if (!req.auth_context || req.auth_context === undefined) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const { data: posAuth } = await query.graph({
    entity: "customer",
    fields: ["pos_auth.code", "pos_auth.nfc_code"],
    filters: {
      id: req.auth_context.actor_id,
    },
  });

  log(posAuth[0].pos_auth);
  if (posAuth[0].pos_auth === undefined) {
    return res.status(404).json({ posAuth: undefined });
  }

  return res.json(posAuth[0].pos_auth);
};
