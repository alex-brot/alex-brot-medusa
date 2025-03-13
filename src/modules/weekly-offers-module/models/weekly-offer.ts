import { model } from "@medusajs/framework/utils";

const WeeklyOffer = model
  .define("weekly_offer", {
    id: model.id().primaryKey(),
    title: model.text(),
    start: model.dateTime(),
    end: model.dateTime(),
  })
  .checks([(columns) => `${columns.start} < ${columns.end}`]);

export default WeeklyOffer;
