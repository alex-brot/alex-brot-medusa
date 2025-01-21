import { createStep, createWorkflow, StepResponse, WorkflowResponse, } from "@medusajs/framework/workflows-sdk";
import PosService from "../modules/pos-module/service";
import { POS_MODULE } from "../modules/pos-module";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { PosAuth } from "../../.medusa/types/query-entry-points";

export type CreatePosAuthWorkflowInput = {
  customerId: string;
};

const createPosAuthStep = createStep(
    "create-posauth-step",
    async (input: CreatePosAuthWorkflowInput, { container }) => {
        const posAuthService: PosService = container.resolve(POS_MODULE);
        let isValidCode = false;
        let validCode: number | undefined = undefined;

        const query = container.resolve(ContainerRegistrationKeys.QUERY)

        while (!isValidCode) {
            const code = Math.floor(1000 + Math.random() * 9000);
            const { data } = await query.graph({
                entity: "pos_auth",
                fields: ["code"],
                filters: {
                    code: code.toString(),
                },
            });

            if (data.length == 0) {
                isValidCode = true;
                validCode = code;
            }
        }

        if (!validCode) {
            throw new Error("Could not generate a valid code");
        }

        //TODO: fix Type because currently it is not possible to get PosAuth from query-entry-points.d.ts
        const posAuth: PosAuth | undefined = await posAuthService.createPosAuths({
            code: validCode,
            nfcCode: null,
        });

        if (!posAuth) {
            throw new Error("Could not create pos auth");
        }

        const remoteLinkService = container.resolve("remoteLink");

        const createLink = async (
            customerId: string,
            posAuth: PosAuth
        ) => {
            try {
                await remoteLinkService.create({
                    [POS_MODULE]: {
                        pos_auth_id: posAuth.id,
                    },
                    [Modules.PRODUCT]: {
                        customer_id: customerId,
                    },
                });
            } catch (error) {
                return error;
            }

            return true;
        };

        await createLink(input.customerId, posAuth)

        return new StepResponse(true);
    }
);
//TODO: create compensation for the case that the step fails

export const createPosAuthWorkflow = createWorkflow(
  "create-posauth-workflow",
  (input: CreatePosAuthWorkflowInput) => {
    const creatingPosAuthStep = createPosAuthStep(input);

    if (creatingPosAuthStep) {
      return new WorkflowResponse(true);
    } else {
      return new WorkflowResponse(false);
    }
  }
);
