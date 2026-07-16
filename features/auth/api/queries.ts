import { queryOptions } from "@tanstack/react-query"

import { authKeys } from "@/features/auth/api/keys"
import type { AuthUser, Session } from "@/features/auth/types"

async function fetchSession(): Promise<Session | null> {
  const response = await fetch("/api/auth/session", {
    credentials: "include",
    cache: "no-store",
  })

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as { user: AuthUser | null }
  return data.user ? { user: data.user } : null
}

export const authQueries = {
  session: () =>
    queryOptions({
      queryKey: authKeys.session(),
      queryFn: fetchSession,
      retry: false,
    }),
}
