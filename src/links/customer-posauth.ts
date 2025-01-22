import { defineLink } from "@medusajs/framework/utils";
import CustomerModule from "@medusajs/medusa/customer";
import posModule from "../modules/pos-module";

export default defineLink(
  {
    linkable: posModule.linkable.posAuth,
  },
  {
    linkable: CustomerModule.linkable.customer,
  }
);
