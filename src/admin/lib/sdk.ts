import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: "https://dev.medusa.alex-brot.stenz.dev",
  debug: process.env.NODE_ENV === "development",
  auth: {
    type: "session",
  },
})
