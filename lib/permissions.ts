import { cache } from "react"

import type { AuthUser } from "@/features/auth/types"
import { getUser } from "@/lib/get-user"

export const PERMISSION_KEYS = {
  viewUsers: "view_users",
  manageUsers: "manage_users",
  viewLoans: "view_loans",
  reviewLoans: "review_loans",
  approveLoans: "approve_loans",
  disburseLoans: "disburse_loans",
  viewLoanProducts: "view_loan_products",
  manageLoanProducts: "manage_loan_products",
  createLoanProducts: "create_loan_products",
  viewTransactions: "view_transactions",
  manageRepayments: "manage_repayments",
  onboardClients: "onboard_clients",
} as const

export type PermissionKey =
  (typeof PERMISSION_KEYS)[keyof typeof PERMISSION_KEYS]

export type Permissions = {
  canViewUsers: boolean
  canManageUsers: boolean
  canViewLoans: boolean
  canReviewLoans: boolean
  canApproveLoans: boolean
  canDisburseLoans: boolean
  canViewLoanProducts: boolean
  canManageLoanProducts: boolean
  canCreateLoanProducts: boolean
  canViewTransactions: boolean
  canManageRepayments: boolean
  canOnboardClients: boolean
}

function userHasPermission(user: AuthUser, permission: PermissionKey) {
  if (user.role === "admin") {
    return true
  }

  return (user.permissions ?? []).some((entry) => entry.name === permission)
}

function buildPermissions(user: AuthUser): Permissions {
  return {
    canViewUsers: userHasPermission(user, PERMISSION_KEYS.viewUsers),
    canManageUsers: userHasPermission(user, PERMISSION_KEYS.manageUsers),
    canViewLoans: userHasPermission(user, PERMISSION_KEYS.viewLoans),
    canReviewLoans: userHasPermission(user, PERMISSION_KEYS.reviewLoans),
    canApproveLoans: userHasPermission(user, PERMISSION_KEYS.approveLoans),
    canDisburseLoans: userHasPermission(user, PERMISSION_KEYS.disburseLoans),
    canViewLoanProducts: userHasPermission(
      user,
      PERMISSION_KEYS.viewLoanProducts,
    ),
    canManageLoanProducts: userHasPermission(
      user,
      PERMISSION_KEYS.manageLoanProducts,
    ),
    canCreateLoanProducts: userHasPermission(
      user,
      PERMISSION_KEYS.createLoanProducts,
    ),
    canViewTransactions: userHasPermission(
      user,
      PERMISSION_KEYS.viewTransactions,
    ),
    canManageRepayments: userHasPermission(
      user,
      PERMISSION_KEYS.manageRepayments,
    ),
    canOnboardClients: userHasPermission(user, PERMISSION_KEYS.onboardClients),
  }
}

export const getPermissions = cache(async (): Promise<Permissions> => {
  const user = await getUser()

  return buildPermissions(user)
})

const permissionFlagByKey: Record<PermissionKey, keyof Permissions> = {
  [PERMISSION_KEYS.viewUsers]: "canViewUsers",
  [PERMISSION_KEYS.manageUsers]: "canManageUsers",
  [PERMISSION_KEYS.viewLoans]: "canViewLoans",
  [PERMISSION_KEYS.reviewLoans]: "canReviewLoans",
  [PERMISSION_KEYS.approveLoans]: "canApproveLoans",
  [PERMISSION_KEYS.disburseLoans]: "canDisburseLoans",
  [PERMISSION_KEYS.viewLoanProducts]: "canViewLoanProducts",
  [PERMISSION_KEYS.manageLoanProducts]: "canManageLoanProducts",
  [PERMISSION_KEYS.createLoanProducts]: "canCreateLoanProducts",
  [PERMISSION_KEYS.viewTransactions]: "canViewTransactions",
  [PERMISSION_KEYS.manageRepayments]: "canManageRepayments",
  [PERMISSION_KEYS.onboardClients]: "canOnboardClients",
}

export function hasPermission(
  permissions: Permissions,
  permission: PermissionKey | null,
) {
  if (!permission) {
    return true
  }

  return permissions[permissionFlagByKey[permission]]
}
