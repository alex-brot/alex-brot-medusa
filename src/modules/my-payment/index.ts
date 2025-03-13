import CustomPaymentProviderService from "./service";
import { ModuleProvider } from "@medusajs/framework/utils";

export default ModuleProvider("my-payment", {
  services: [CustomPaymentProviderService],
});
