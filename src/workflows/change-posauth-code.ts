import { createStep, createWorkflow, StepResponse, WorkflowResponse, } from "@medusajs/framework/workflows-sdk";
import { POS_MODULE } from "../modules/pos-module";
import PosService from "../modules/pos-module/service";

export type PatchPosAuthCodeType = {
    id: string;
    newCode: string;
};

export const changePosAuthCodeStep = createStep(
  "change-code-step",
  async (input: PatchPosAuthCodeType, { container }) => {
    const posAuthService: PosService = container.resolve(POS_MODULE);

    const posAuth = await posAuthService.updatePosAuths({
        id: input.id,
        code: input.newCode,
    });

    return new StepResponse(posAuth);
  }
);

export const changePosAuthCodeWorkflow = createWorkflow(
  "change-posauth-code-workflow",
  (input: PatchPosAuthCodeType) => {
    const creatingPosAuthStep = changePosAuthCodeStep(input);
    return new WorkflowResponse(creatingPosAuthStep);
  }
);
