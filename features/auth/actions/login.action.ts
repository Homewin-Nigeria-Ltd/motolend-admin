"use server"

import { cookies } from "next/headers"

import { AUTH_COOKIE_NAME } from "@/constants/auth"
import { authEndpoints } from "@/features/auth/api/endpoints"
import type { LoginPayload } from "@/features/auth/schemas/login.schema"
import { loginSchema } from "@/features/auth/schemas/login.schema"
import type {
  LoginActionResult,
  LoginResponseData,
  ResendOtpResult,
} from "@/features/auth/types"
import { ApiError } from "@/lib/api/client"
import { apiServer } from "@/lib/api/server-client"

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

function readToken(response: LoginResponseData) {
  return response.token || response.access_token || ""
}

function isOtpChallenge(response: LoginResponseData) {
  if (
    response.otp_required === true ||
    response.requires_otp === true ||
    response.otp_sent === true
  ) {
    return true
  }

  return !readToken(response)
}

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

  const otp = parsed.data.otp?.trim()
  const payload: LoginPayload = {
    login: parsed.data.login,
    password: parsed.data.password,
    ...(otp ? { otp } : {}),
  }

  try {
    const response = await apiServer.post<LoginResponseData, LoginPayload>(
      authEndpoints.login,
      payload,
      { auth: false },
    )

    if (!response || typeof response !== "object") {
      return {
        success: false,
        error: "Sign in could not be completed",
      }
    }

    const token = readToken(response)

    if (token) {
      await setAuthCookie(token)
      return { success: true }
    }

    if (!otp && isOtpChallenge(response)) {
      return { success: true, otpRequired: true }
    }

    return {
      success: false,
      error: response.message || "Authentication token was not returned",
    }
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

export async function resendOtpAction(input: {
  login: string
  password: string
}): Promise<ResendOtpResult> {
  const login = input.login.trim()
  const password = input.password

  if (!login || !password) {
    return { success: false, error: "Email and password are required" }
  }

  try {
    await apiServer.post(
      authEndpoints.resendOtp,
      { login, password },
      { auth: false },
    )
    return { success: true }
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message || "Could not resend the code",
      }
    }

    throw error
  }
}
