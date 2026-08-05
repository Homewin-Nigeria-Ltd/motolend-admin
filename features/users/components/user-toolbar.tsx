"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserFilterTabs } from "@/features/users/components/user-filter-tabs"
import { useRoles } from "@/features/role-permissions/hooks/use-roles"
import type { UserTab } from "@/features/users/types"

export const ALL_ROLES_VALUE = "all"

type UserRoleFilterDropdownProps = {
  roleId: string
  onRoleIdChange: (value: string) => void
}

function UserRoleFilterDropdown({
  roleId,
  onRoleIdChange,
}: UserRoleFilterDropdownProps) {
  const {
    data: roles,
    isPending: isRolesPending,
    isError: isRolesError,
  } = useRoles()

  return (
    <Select
      value={roleId}
      onValueChange={onRoleIdChange}
      disabled={isRolesPending || isRolesError}
    >
      <SelectTrigger className="h-10 w-[160px] border-border bg-background">
        <SelectValue
          placeholder={
            isRolesPending
              ? "Loading roles…"
              : isRolesError
                ? "Roles unavailable"
                : "All roles"
          }
        />
      </SelectTrigger>
      <SelectContent position="popper">
        <SelectItem value={ALL_ROLES_VALUE}>All roles</SelectItem>
        {(roles ?? []).map((role) => (
          <SelectItem key={role.id} value={String(role.id)}>
            {role.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

type UserToolbarProps = {
  tab: UserTab
  onTabChange: (value: UserTab) => void
  search: string
  onSearchChange: (value: string) => void
  onCreateAdminUser: () => void
  showViewAllUsers?: boolean
  showRoleFilter?: boolean
  roleId?: string
  onRoleIdChange?: (value: string) => void
}

export function UserToolbar({
  tab,
  onTabChange,
  search,
  onSearchChange,
  onCreateAdminUser,
  showViewAllUsers = false,
  showRoleFilter = false,
  roleId = ALL_ROLES_VALUE,
  onRoleIdChange,
}: UserToolbarProps) {
  return (
    <div className="flex w-full flex-col gap-4 border-b border-border px-4 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <UserFilterTabs value={tab} onChange={onTabChange} />

        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-[200px] flex-1 sm:max-w-xs">
            <Input
              type="search"
              icon={{ name: "search", position: "left" }}
              placeholder="Search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              className="h-10"
            />
          </div>

          {showRoleFilter && tab === "admin" && onRoleIdChange ? (
            <UserRoleFilterDropdown
              roleId={roleId}
              onRoleIdChange={onRoleIdChange}
            />
          ) : null}

          {showViewAllUsers ? (
            <Button type="button" variant="outline" className="h-10 px-4" asChild>
              <Link href="/users">View All Users</Link>
            </Button>
          ) : null}

          <Button
            type="button"
            className="h-10 px-4"
            icon={{ name: "add", position: "left" }}
            onClick={onCreateAdminUser}
          >
            Add Admin
          </Button>
        </div>
      </div>
    </div>
  )
}
