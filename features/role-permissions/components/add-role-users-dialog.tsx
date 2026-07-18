"use client"

import { useState } from "react"

import { PermissionsSearchInput } from "@/features/role-permissions/components/permissions-search-input"
import { useUserList } from "@/features/users/hooks/use-user-list"
import type { UserRecord } from "@/features/users/types"
import { AppLoader } from "@/components/ui/app-loader"
import { BaseModal } from "@/components/ui/base-modal"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

type AddRoleUsersDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedUsers: UserRecord[]
  onConfirm: (users: UserRecord[]) => void
}

export function AddRoleUsersDialog({
  open,
  onOpenChange,
  selectedUsers,
  onConfirm,
}: AddRoleUsersDialogProps) {
  const [search, setSearch] = useState("")
  const [draftSelectedUsers, setDraftSelectedUsers] =
    useState<UserRecord[]>(selectedUsers)

  const { data, isPending, isFetching, isError } = useUserList({
    page: 1,
    per_page: 50,
    tab: "admin",
    search,
  })

  const users = data?.items ?? []

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setDraftSelectedUsers(selectedUsers)
      setSearch("")
    } else {
      setSearch("")
    }

    onOpenChange(next)
  }

  const isUserSelected = (userId: string) =>
    draftSelectedUsers.some((user) => user.id === userId)

  const toggleUser = (user: UserRecord, checked: boolean) => {
    setDraftSelectedUsers((current) => {
      if (checked) {
        if (current.some((entry) => entry.id === user.id)) {
          return current
        }

        return [...current, user]
      }

      return current.filter((entry) => entry.id !== user.id)
    })
  }

  const handleConfirm = () => {
    onConfirm(draftSelectedUsers)
    handleOpenChange(false)
  }

  return (
    <BaseModal
      title="Add Users"
      layout="detail"
      size="lg"
      open={open}
      onOpenChange={handleOpenChange}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" className="rounded" onClick={handleConfirm}>
            Add Selected
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <PermissionsSearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search users"
        />

        {isPending && users.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <AppLoader spinnerClassName="size-8" />
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive">Could not load users.</p>
        ) : users.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {search.trim()
              ? "No users match your search."
              : "No admin users found."}
          </p>
        ) : (
          <div className="space-y-1">
            {isFetching ? (
              <p className="text-xs text-muted-foreground">Searching…</p>
            ) : null}

            <div className="max-h-80 overflow-y-auto rounded-lg border border-border">
              {users.map((user) => (
                <label
                  key={user.id}
                  className="flex cursor-pointer items-start gap-3 border-b border-border px-4 py-3 last:border-b-0 hover:bg-muted/40"
                >
                  <Checkbox
                    checked={isUserSelected(user.id)}
                    onCheckedChange={(checked) =>
                      toggleUser(user, checked === true)
                    }
                    aria-label={`Select ${user.name}`}
                    className="mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                    {user.role ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {user.role}
                      </p>
                    ) : null}
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {draftSelectedUsers.length > 0 ? (
          <p className="text-sm text-muted-foreground">
            {draftSelectedUsers.length} user
            {draftSelectedUsers.length === 1 ? "" : "s"} selected
          </p>
        ) : null}
      </div>
    </BaseModal>
  )
}
