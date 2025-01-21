import { time } from "console";
import { z } from "zod";

export const PostAdminCreateEntryTimestamp = z.object({
  typeOfEntry: z.enum(["NFC", "CODE"]).default("CODE"),
  code: z.string(),
  timestamp: z.date(),
});
