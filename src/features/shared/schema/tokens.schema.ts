import z from "zod"
import { userSchemaBase } from "../../user/schema/user.schema"

export const tokensSchema = z.object( {
    accessToken: z.string(),
    refreshToken: z.string()
})

export const authResponseSchema = z.object({
    accessToken: z.string(),
    user:userSchemaBase
})

export type Tokens = z.infer<typeof tokensSchema>
export type AuthResponse = z.infer<typeof authResponseSchema>
