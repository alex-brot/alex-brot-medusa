import { MedusaService } from "@medusajs/framework/utils";
import WeeklyOffer from "./models/weekly-offer";

class WeeklyOffersModuleService extends MedusaService({
  WeeklyOffer,
}) {}

export default WeeklyOffersModuleService;
