import z from "zod"
import { userSchemaBase } from "../../user/schema/user.schema"

export const tokensDTOSchema = z.object( {
    accessToken: z.string(),
    refreshToken: z.string()
})

export const authResponseDTOSchema = z.object({
    accessToken: z.string(),
    user:userSchemaBase
})

export type TokensDTO = z.infer<typeof tokensDTOSchema>
export type AuthResponseDTO = z.infer<typeof authResponseDTOSchema>
