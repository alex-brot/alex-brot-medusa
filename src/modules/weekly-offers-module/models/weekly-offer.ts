import { model } from "@medusajs/framework/utils";

const WeeklyOffer = model.define("weekly_offer", {
    id: model.id().primaryKey(),
    title: model.text(),
    from: model.dateTime(),
    to: model.dateTime(),
});

export default WeeklyOffer;
