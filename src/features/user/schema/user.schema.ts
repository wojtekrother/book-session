import z from "zod"
import { auditSchema } from "../../shared/schema/roles.schema"


export const roleSchema = z.enum(["user", "admin"])


export const userProfileSchema = z.object({
    id: z.string(),
    role: roleSchema,
    first_name: z.string(),
    last_name: z.string()
})

export const likedEventsResponseSchema = z.array(
  z.object({
    event_id: z.string(),
  })
);

export const likedEventResponseSchema = 
  z.object({
    event_id: z.string(),
  }).nullable()

export const userLikedEventsSchema =  z.array(z.string())



export const userSchemaBase = z.object({
    id: z.string(),
    email: z.email(),
    eventsIds: z.array(z.string()),
    role: roleSchema,
    firstName: z.string(),
    lastName: z.string()
});

export const userAuthSchema = z.object({
    email: z.email(),
    password: z.string()
});


export const userLoginSchema = userAuthSchema

export const userRegisterSchema = userAuthSchema.extend({
    confirmPassword: z.string(),
    first_name: z.string(),
    last_name: z.string()
});

export const userSchema = userSchemaBase.extend(auditSchema.shape);

export type userLikedEventsDTO = z.infer<typeof userLikedEventsSchema>
export type UserDTO = z.infer<typeof userSchema>;
export type UserCreateDTO = z.infer<typeof userRegisterSchema>;
export type UserLoginDTO = z.infer<typeof userLoginSchema>;
