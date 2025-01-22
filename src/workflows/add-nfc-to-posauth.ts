import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { PatchPosAuthType as PatchNfc } from "../api/admin/pos-auth/route";
import { POS_MODULE } from "../modules/pos-module";
import PosService from "../modules/pos-module/service";


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
