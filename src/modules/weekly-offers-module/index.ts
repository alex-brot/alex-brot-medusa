import { Module } from "@medusajs/framework/utils";
import WeeklyOffersModuleService from "./service";

export const WEEKLY_OFFERS_MODULE = "weeklyOffers";

export default Module(WEEKLY_OFFERS_MODULE, {
  service: WeeklyOffersModuleService,
});
