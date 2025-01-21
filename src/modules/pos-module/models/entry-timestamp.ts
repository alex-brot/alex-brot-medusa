import { model } from "@medusajs/framework/utils";
import PosAuth from "./pos-auth";

const EntryTimestamp = model.define("entry_timestamp", {
  id: model.id().primaryKey(),
  timestamp: model.dateTime(),
  typeOfEntry: model.enum(["NFC", "CODE"]).default("CODE"),
  posAuth: model.belongsTo(() => PosAuth, {
    mappedBy: "entryTimestamps",
  }),
});

export default EntryTimestamp;
