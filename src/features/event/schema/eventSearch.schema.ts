import z from "zod";

export const eventSearchDateOrderSchema = z.enum(["asc", "desc"]).default("desc")


export const eventSearchSchema = z.object({
    title: z.string(),
    description: z.string(),
    dateOrder: eventSearchDateOrderSchema
})

export type EventSearchForm = z.infer<typeof eventSearchSchema>
