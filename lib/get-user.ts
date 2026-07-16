import { cache } from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { AUTH_COOKIE_NAME, AUTH_USER_COOKIE_NAME } from "@/constants/auth"
import type { AuthUser } from "@/features/auth/types"

function parseAuthUser(value: string | undefined): AuthUser | null {
  if (!value) {
    return null
  }

  try {
    const user = JSON.parse(value) as AuthUser

    if (!user?.id || !user?.email) {
      return null
    }

    return user
  } catch {
    return null
  }
}

export const getUser = cache(async (): Promise<AuthUser> => {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value
  const user = parseAuthUser(cookieStore.get(AUTH_USER_COOKIE_NAME)?.value)

  if (!token || !user) {
    redirect("/api/auth/clear-session")
  }

  return user
})
