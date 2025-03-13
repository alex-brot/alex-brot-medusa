import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { changePosAuthCodeWorkflow } from "../../../../workflows/change-posauth-code";

export type ChangeCodeRequest = {
    id: string;
    newCode: string;
};
export const POST = async (req: MedusaRequest<ChangeCodeRequest>, res: MedusaResponse) => {
    const { result } = await changePosAuthCodeWorkflow(req.scope).run({
        input: {
            id: req.body.id,
            newCode: req.body.newCode,
        },
    });

    return res.status(201).json(result);
}
