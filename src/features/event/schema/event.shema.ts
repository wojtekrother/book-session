import { z } from "zod";
import { auditSchema } from "../../shared/schema/roles.schema";



const eventSchemaBase = z.object({
    id: z.string().optional(),
    title: z.string().max(50).min(1),
    summary: z.string(),
    description: z.string().min(3).max(1000),
    duration: z.number(),
    date: z.coerce.date(),
    image: z.string().optional().nullable(),
    imageUrl: z.string().optional().nullable(),
});

export const eventSchema = eventSchemaBase.extend(auditSchema.shape);
export const createEventSchema = eventSchemaBase.omit({id:true});
export const updateEventSchema = eventSchemaBase.partial().omit({id:true}).extend({ id: z.string() });

export type EventDTO = z.infer<typeof eventSchema>;
export type EventUpdateDTO = z.infer<typeof updateEventSchema>;
export type EventCreateDTO = z.infer<typeof createEventSchema>;