import { queryOptions } from "@tanstack/react-query"

import { authEndpoints } from "@/features/auth/api/endpoints"
import { authKeys } from "@/features/auth/api/keys"
import type { MeApiResponse, Session } from "@/features/auth/types"
import { mapApiAuthUserToAuthUser } from "@/features/auth/utils/auth-user"
import { ApiError, api } from "@/lib/api/client"

export const authQueries = {
  session: () =>
    queryOptions({
      queryKey: authKeys.session(),
      queryFn: async (): Promise<Session | null> => {
        try {
          const { user } = await api.get<MeApiResponse>(authEndpoints.me)

          if (!user) {
            return null
          }

          return { user: mapApiAuthUserToAuthUser(user) }
        } catch (error) {
          if (
            error instanceof ApiError &&
            (error.status === 401 || error.status === 403)
          ) {
            return null
          }

          throw error
        }
      },
      retry: false,
    }),
}
