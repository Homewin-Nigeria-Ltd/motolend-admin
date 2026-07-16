"use server"

import { cookies } from "next/headers"

import { AUTH_COOKIE_NAME, AUTH_USER_COOKIE_NAME } from "@/constants/auth"
import { authEndpoints } from "@/features/auth/api/endpoints"
import { ApiError } from "@/lib/api/client"
import { apiServer } from "@/lib/api/server-client"

async function clearAuthCookies() {
  const cookieStore = await cookies()
  cookieStore.delete({
    name: AUTH_COOKIE_NAME,
    path: "/",
  })
  cookieStore.delete({
    name: AUTH_USER_COOKIE_NAME,
    path: "/",
  })
}

export async function logoutAction(): Promise<void> {
  try {
    await apiServer.post(authEndpoints.logout)
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw error
    }
  } finally {
    await clearAuthCookies()
  }
}
