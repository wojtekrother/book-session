import { z } from "zod";
import { auditSchema } from "../../shared/schema/roles.schema";


export const eventCategorySchema = z.enum(["science", "culture", "entertainment","uncategorized"])


const eventSchemaBase = z.object({
    id: z.string().optional(),
    title: z.string().min(1).max(50),
    summary: z.string().min(1).max(150),
    description: z.string().min(3).max(1000),
    duration: z.number().min(1).max(365),
    category: eventCategorySchema,
    date: z.coerce.date(),
    image: z.string().optional().nullable(),
    image_url: z.string().optional().nullable(),
});

export const eventSchema = eventSchemaBase.extend(auditSchema.shape);
export const createEventSchema = eventSchemaBase.omit({id:true});
export const updateEventSchema = eventSchemaBase.partial().omit({id:true}).extend({ id: z.string() });

export type EventDTO = z.infer<typeof eventSchema>;
export type EventUpdateDTO = z.infer<typeof updateEventSchema>;
export type EventCreateDTO = z.infer<typeof createEventSchema>;