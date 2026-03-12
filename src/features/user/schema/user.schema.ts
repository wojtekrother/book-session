import z from "zod"
import { auditSchema } from "../../shared/schema/roles.schema"


export const roleSchema =  z.enum(["User", "Admin"])

export const userSchemaBase = z.object({
    id: z.string(),
    email: z.email(),
    eventsIds: z.array(z.string()),
    role: roleSchema
});

export const userCreateSchema = z.object({
    email: z.email(),
    password: z.string()
});

export const userSchema = userSchemaBase.extend(auditSchema.shape);


export type UserDTO = z.infer<typeof userSchema>;
export type UserCreateDTO = z.infer<typeof userCreateSchema>;
