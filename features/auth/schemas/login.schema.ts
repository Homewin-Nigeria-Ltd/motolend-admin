import { z } from "zod/v3"

export const loginSchema = z.object({
  login: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type LoginPayload = LoginInput
