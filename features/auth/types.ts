export type AuthUserPermission = {
  id: number
  name: string
  guard_name: string
  created_at?: string
  updated_at?: string
}

export type AuthUserRole = {
  id: number
  name: string
  guard_name?: string
  description?: string | null
  permissions?: AuthUserPermission[]
}

export type AuthUser = {
  id: string
  first_name: string
  last_name: string
  middle_name?: string | null
  email: string
  phone: string
  status: string
  role: string
  account_status: string
  email_verified_at?: string | null
  phone_verified_at?: string | null
  created_at?: string
  updated_at?: string
  roles?: AuthUserRole[]
  permissions?: AuthUserPermission[]
  profile_photo_url?: string | null
}

export type LoginActionResult =
  | { success: true }
  | { success: false; error: string }

export type LoginResponseData = {
  token: string
  access_token?: string
  user?: AuthUser
}

export type MeResponseData = {
  user: AuthUser
}

export type MeApiResponse = {
  user: AuthUser
  roles: AuthUserRole[]
  permissions: AuthUserPermission[]
}
