import z from "zod";

export const auditSchema = z.object({
    deleteAt: z.string().optional(),
    createdAt: z.string().optional(),
    modifiedAt: z.string().optional()
});