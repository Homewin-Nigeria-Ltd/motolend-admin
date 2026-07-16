export type AuthUserPermission = {
  key: string
  name: string
  description: string
  has_access: boolean
}

export type AuthUser = {
  id: string
  name: string
  email: string
  phone: string
  role: string
  status: string
  profile_photo_url: string | null
  admin_role?: string | null
  permissions?: AuthUserPermission[]
  permission_keys?: string[]
}

export type Session = {
  user: AuthUser
}

export type LoginActionResult =
  | { success: true }
  | { success: false; error: string }

export type ApiAuthUser = {
  id: string
  first_name: string
  last_name: string
  middle_name?: string | null
  email: string
  phone: string
  status: string
  role: string
  account_status: string
}

export type LoginResponseData = {
  token: string
  access_token?: string
  user: ApiAuthUser
}

export type MeResponseData = {
  user: ApiAuthUser
}

export type MeApiResponse = {
  success?: boolean
  data?: MeResponseData
  user?: ApiAuthUser
}
