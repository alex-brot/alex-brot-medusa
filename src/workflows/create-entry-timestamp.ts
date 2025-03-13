import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { z } from "zod";
import { POS_MODULE } from "../modules/pos-module";
import PosService from "../modules/pos-module/service";
import { PostAdminCreateEntryTimestamp } from "../api/admin/pos-auth/entry-timestamps/validators";

type PostAdminCreateEntryTimestampType = z.infer<
  typeof PostAdminCreateEntryTimestamp
>;

export const createEntryTimeStampStep = createStep(
  "create-entry-timestamp-step",
  async (input: PostAdminCreateEntryTimestampType, { container }) => {
    const posAuthService: PosService = container.resolve(POS_MODULE);

    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    let posAuthId: string | undefined = undefined;
    if (input.typeOfEntry === "CODE") {
      const { data } = await query.graph({
        entity: "pos_auth",
        fields: ["id"],
        filters: {
          code: input.code,
        },
      });
      posAuthId = data[0].id;
    }
    //TODO:?? fix ??
    //requirements: nfcCode doesn't work???
    else {
      const { data } = await query.graph({
        entity: "pos_auth",
        fields: ["id"],
        filters: {
          nfcCode: input.code as string,
        } as any,
      });
      posAuthId = data[0].id;
    }

    if (!posAuthId) {
      throw new Error("Could not find pos auth");
    }

    const entryTimeStamp = await posAuthService.createEntryTimestamps({
      pos_auth_id: posAuthId,
      typeOfEntry: input.typeOfEntry,
      timestamp: input.timestamp,
    });

    return new StepResponse(entryTimeStamp);
  }
);

export const createEntryTimeStampWorkflow = createWorkflow(
  "create-entry-timestamp-workflow",
  (input: PostAdminCreateEntryTimestampType) => {
    const creatingPosAuthStep = createEntryTimeStampStep(input);
    return new WorkflowResponse(creatingPosAuthStep);
  }
);
