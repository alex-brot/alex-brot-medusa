import { MedusaService } from "@medusajs/framework/utils";
import PosAuth from "./models/pos-auth";


class PosService extends MedusaService({
    PosAuth,
}) {}

export default PosService;
