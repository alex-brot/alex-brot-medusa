import { model } from "@medusajs/framework/utils";

const WeeklyOffer = model.define("weekly_offer", {
    id: model.id().primaryKey(),
    name: model.text(),
    start: model.dateTime(),
    end: model.dateTime(),
});

export default WeeklyOffer;
