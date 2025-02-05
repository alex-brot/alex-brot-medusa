import { MedusaRequest, MedusaResponse, Query } from "@medusajs/framework";
import { z } from "zod";
import { PostAdminCreateEntryTimestamp } from "./validators";
import {createEntryTimeStampWorkflow} from "../../../../workflows/create-entry-timestamp";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

type PostAdminCreateEntryTimestampType = z.infer<
  typeof PostAdminCreateEntryTimestamp
>;

export const POST = async (
  req: MedusaRequest<PostAdminCreateEntryTimestampType>,
  res: MedusaResponse
) => {
  console.log(req.scope);
  console.log(req.body);

  const { result } = await createEntryTimeStampWorkflow(req.scope).run({
    input: {
      typeOfEntry: req.body.typeOfEntry,
      code: req.body.code,
      timestamp: req.body.timestamp,
    },
  });
  return res.status(201).json(result);
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve<Query>(ContainerRegistrationKeys.QUERY)

  const { data } = await query.graph({
    entity: "entry_timestamp",
    fields: ["*", "posAuth.customer.*"],
    pagination: {
      skip: 0,
      order: {
        created_at: "desc",
      }
    }
  })
  return res.json(data)
}
