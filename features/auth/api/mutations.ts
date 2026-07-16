import { loginAction } from "@/features/auth/actions/login.action"
import { logoutAction } from "@/features/auth/actions/logout.action"
import type { LoginPayload } from "@/features/auth/schemas/login.schema"

export const authMutations = {
  login: {
    mutationFn: (data: LoginPayload) => loginAction(data),
  },
  logout: {
    mutationFn: () => logoutAction(),
  },
}
