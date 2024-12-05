import { Module } from "@medusajs/framework/utils";
import AllergenModuleService from "./service";


export const ALLERGEN_MODULE = "allergenModuleService";

export default Module(ALLERGEN_MODULE, {
  service: AllergenModuleService,
});
