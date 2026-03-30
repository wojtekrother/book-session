import { z } from "zod";
import { auditSchema } from "../../shared/schema/roles.schema";



const eventSchemaBase = z.object({
    id: z.string().optional(),
    title: z.string().min(1).max(50),
    summary: z.string().min(1).max(150),
    description: z.string().min(3).max(1000),
    duration: z.number().min(1).max(365),
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