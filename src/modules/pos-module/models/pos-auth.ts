import { model } from "@medusajs/framework/utils";
import EntryTimestamp from "./entry-timestamp";

const PosAuth = model.define("pos_auth", {
  id: model.id().primaryKey(),
  nfcCode: model.text().nullable(),
  code: model.text(),
  entryTimestamps: model.hasMany(() => EntryTimestamp, {
    mappedBy: "posAuth",
  }),
});

export default PosAuth;
