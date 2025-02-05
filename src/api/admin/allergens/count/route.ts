import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { MODULE_DEFINITIONS, MODULE_SCOPE } from "@medusajs/framework/modules-sdk";
import { Module } from "@medusajs/framework/utils";
import { ALLERGEN_MODULE } from "src/modules/allergen-module";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const allergenService = req.scope.resolve(ALLERGEN_MODULE)

    const orderCount = await allergenService.getCountSql();

    return res.json({ count: orderCount });
}