export const authEndpoints = {
  login: "/admin/auth/login",
  resendOtp: "/admin/auth/resend-otp",
  logout: "/admin/auth/logout",
  me: "/api/proxy/admin/me",
  meServer: "/admin/me",
} as const
