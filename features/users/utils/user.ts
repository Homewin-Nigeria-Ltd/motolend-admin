import type {
  ApiAdminUser,
  UserRecord,
  UserStatus,
  UserTab,
} from "@/features/users/types"

export function formatUserCreatedAt(iso: string) {
  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) {
    return iso
  }

  const datePart = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date)

  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .format(date)
    .replace(" ", "")

  return `${datePart} | ${timePart}`
}

export function formatSignedUpOn(iso: string) {
  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) {
    return iso
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export function getApiUserDisplayName(user: ApiAdminUser) {
  return (
    [user.first_name, user.middle_name, user.last_name]
      .filter(Boolean)
      .join(" ") || user.email
  )
}

export function mapAccountStatusToUserStatus(
  accountStatus: string,
  role?: string,
): UserStatus {
  if (role?.toLowerCase() === "admin") {
    return "Admin"
  }

  const normalized = accountStatus.trim().toLowerCase()

  if (normalized === "inactive") {
    return "Inactive"
  }

  if (normalized === "deactivated") {
    return "Deactivated"
  }

  return "Active"
}

export function mapApiUserToUserRecord(user: ApiAdminUser): UserRecord {
  return {
    id: user.id,
    createdAt: formatUserCreatedAt(user.created_at),
    name: getApiUserDisplayName(user),
    email: user.email,
    accountNumber: user.profile?.account_number ?? "—",
    phoneNumber: user.phone || "—",
    status: mapAccountStatusToUserStatus(user.account_status, user.role ?? ""),
  }
}

export function extractApiUser(
  response: ApiAdminUser | { data?: ApiAdminUser; user?: ApiAdminUser },
): ApiAdminUser | null {
  if (!response || typeof response !== "object") {
    return null
  }

  if ("first_name" in response && "email" in response && "id" in response) {
    return response
  }

  return response.data ?? response.user ?? null
}

export function tabToListQuery(tab: UserTab) {
  if (tab === "admin") {
    return { role: "admin" as const }
  }

  return { status: tab }
}
