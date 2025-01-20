import { MedusaService } from "@medusajs/framework/utils";
import PosAuth from "./models/pos-auth";
import EntryTimestamp from "./models/entry-timestamp";


class PosService extends MedusaService({
    PosAuth,
    EntryTimestamp,
}) {}

export default PosService;
