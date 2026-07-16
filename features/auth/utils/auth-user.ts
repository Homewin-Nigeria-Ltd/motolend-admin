import type { ApiAuthUser, AuthUser } from "@/features/auth/types"

export function mapApiAuthUserToAuthUser(user: ApiAuthUser): AuthUser {
  const name = [user.first_name, user.middle_name, user.last_name]
    .filter(Boolean)
    .join(" ")

  return {
    id: user.id,
    name: name || user.email,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.account_status || user.status,
    profile_photo_url: null,
  }
}
