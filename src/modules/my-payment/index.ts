import CustomPaymentProviderService from "./service";
import { ModuleProvider, Modules } from "@medusajs/framework/utils";

export default ModuleProvider("my-payment", {
  services: [CustomPaymentProviderService],
});
