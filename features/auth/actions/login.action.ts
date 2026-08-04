"use server"

import { cookies } from "next/headers"

import { AUTH_COOKIE_NAME } from "@/constants/auth"
import { authEndpoints } from "@/features/auth/api/endpoints"
import type { LoginPayload } from "@/features/auth/schemas/login.schema"
import { loginSchema } from "@/features/auth/schemas/login.schema"
import type { LoginActionResult, LoginResponseData } from "@/features/auth/types"
import { ApiError } from "@/lib/api/client"
import { apiServer } from "@/lib/api/server-client"

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  })
}

export async function loginAction(data: LoginPayload): Promise<LoginActionResult> {
  const parsed = loginSchema.safeParse(data)

  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid credentials",
    }
  }

  try {
    const response = await apiServer.post<LoginResponseData, LoginPayload>(
      authEndpoints.login,
      parsed.data,
      { auth: false },
    )

    const token = response.token || response.access_token

    if (!token) {
      return {
        success: false,
        error: "Authentication token was not returned",
      }
    }

    await setAuthCookie(token)
    return { success: true }
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message || "Invalid email or password",
      }
    }

    throw error
  }
}
