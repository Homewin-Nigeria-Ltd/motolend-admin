import { loginAction, resendOtpAction } from "@/features/auth/actions/login.action"
import { logoutAction } from "@/features/auth/actions/logout.action"
import type { LoginPayload } from "@/features/auth/schemas/login.schema"

export const authMutations = {
  login: {
    mutationFn: (data: LoginPayload) => loginAction(data),
  },
  resendOtp: {
    mutationFn: (input: { login: string; password: string }) =>
      resendOtpAction(input),
  },
  logout: {
    mutationFn: () => logoutAction(),
  },
}
