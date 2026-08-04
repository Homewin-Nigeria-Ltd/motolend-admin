import "server-only"

import { authEndpoints } from "@/features/auth/api/endpoints"
import type { AuthUser, MeApiResponse } from "@/features/auth/types"
import { mapApiAuthUserToAuthUser } from "@/features/auth/utils/auth-user"
import { ApiError } from "@/lib/api/client"
import { apiServer } from "@/lib/api/server-client"

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    const { user } = await apiServer.get<MeApiResponse>(authEndpoints.meServer)

    if (!user) {
      return null
    }

    return mapApiAuthUserToAuthUser(user)
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 401 || error.status === 403)
    ) {
      return null
    }

    throw error
  }
}
