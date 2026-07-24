import { z } from "zod";
import { auditSchema } from "../../shared/schema/roles.schema";


export const eventCategorySchema = z.enum(["science", "culture", "entertainment", "uncategorized"])


const eventSchemaBase = z.object({
    id: z.uuid().optional(),
    title: z.string().min(1).max(50),
    summary: z.string().min(1).max(150),
    description: z.string().min(3).max(1000),
    duration: z.number().min(1).max(365),
    category: eventCategorySchema,
    date: z.iso.date(),
    owner_user_id: z.uuid().nullable(),
    likes_count: z.number().min(0).default(0)
});

export const eventSchema = eventSchemaBase.extend(auditSchema.shape);
export const createEventSchema = eventSchemaBase.omit({ id: true, likes_count: true }).extend({ image: z.file().nullable() });
export const updateEventSchema = eventSchemaBase.omit({ id: true, likes_count: true }).extend({ id: z.string() }).extend({ image: z.file().nullable().optional() });;

export type EventCategory = z.infer<typeof eventCategorySchema>;

export type EventDTO = z.infer<typeof eventSchema>;
export type EventUpdateDTO = z.infer<typeof updateEventSchema>;
export type EventCreateDTO = z.infer<typeof createEventSchema>;
