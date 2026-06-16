import z from "zod";

export const auditSchema = z.object({
    deleted_at: z.string().nullable(),
    created_at: z.string().nullable(),
    updated_at: z.string().nullable()
});