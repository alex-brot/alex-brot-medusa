import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { PostAdminCreateEntryTimestamp } from "src/api/admin/pos-auth/entry-timestamps/validators";
import { PatchPosAuthType as PatchNfc } from "src/api/admin/pos-auth/route";
import { POS_MODULE } from "src/modules/pos-module";
import PosService from "src/modules/pos-module/service";
import { z } from "zod";


export const addNfcStep = createStep(
  "add-nfc-step",
  async (input: PatchNfc, { container }) => {
    const posAuthService: PosService = container.resolve(POS_MODULE);

     const query = container.resolve(ContainerRegistrationKeys.QUERY);

      const { data } = await query.graph({
        entity: "pos_auth",
        fields: ["id"],
        filters: {
          code: input.code as string,
        },
      });

    if (!data[0].id) {
      throw new Error("Could not find pos auth");
    }

    const posAuth = await posAuthService.updatePosAuths({
        id: data[0].id,
        nfcCode: input.nfcCode,
    });

    return new StepResponse(posAuth);
  }
);

export const addNfcWorkflow = createWorkflow(
  "add-nfc-workflow",
  (input: PatchNfc) => {
    const creatingPosAuthStep = addNfcStep(input);
    return new WorkflowResponse(creatingPosAuthStep);
  }
);
