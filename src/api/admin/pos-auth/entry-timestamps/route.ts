import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { z } from "zod";
import { PostAdminCreateEntryTimestamp } from "./validators";
import { createEntryTimeStampWorkflow } from "src/workflows/create-entry-timestamp";

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
