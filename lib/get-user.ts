import { cache } from "react"
import { redirect } from "next/navigation"

import type { AuthUser } from "@/features/auth/types"
import { fetchCurrentUser } from "@/features/auth/utils/fetch-current-user"

export const getUser = cache(async (): Promise<AuthUser> => {
  const user = await fetchCurrentUser()

  if (!user) {
    redirect("/api/auth/clear-session")
  }

  return user
})
