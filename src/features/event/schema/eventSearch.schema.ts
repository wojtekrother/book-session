import z from "zod";
import { eventCategorySchema } from "./event.schema";

export const eventSearchDateOrderEnum = z.enum(["asc", "desc"]);
export const eventSearchDateOrderSchema = eventSearchDateOrderEnum.default("desc")


export const eventSearchSchema = z.object({
    title: z.string(),
    description: z.string(),
    categories: eventCategorySchema.array(),
    dateOrder: eventSearchDateOrderSchema
})

export type EventSearchForm = z.infer<typeof eventSearchSchema>
export type EventSearchDateOrderEnum = z.infer<typeof eventSearchDateOrderEnum>
