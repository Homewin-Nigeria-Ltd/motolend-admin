"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { DataTable } from "@/components/data-table"
import { AppLoader } from "@/components/ui/app-loader"
import { userColumns } from "@/features/users/columns"
import { CreateAdminUserDialog } from "@/features/users/components/create-admin-user-dialog"
import { UserToolbar } from "@/features/users/components/user-toolbar"
import { UsersListToolbar } from "@/features/users/components/users-list-toolbar"
import { useUserList } from "@/features/users/hooks/use-user-list"
import type { UserRecord, UserTab } from "@/features/users/types"

const PAGE_SIZE = 15

export function UsersListSection() {
  const router = useRouter()
  const [tab, setTab] = useState<UserTab>("active")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)

  const {
    data: userList,
    isPending,
    isFetching,
    isError,
    error,
  } = useUserList({
    page,
    per_page: PAGE_SIZE,
    search,
    tab,
  })

  const users = userList?.items ?? []
  const totalPages = userList?.meta.last_page ?? 1
  const currentPage = userList?.meta.current_page ?? page

  const handleTabChange = (value: UserTab) => {
    setTab(value)
    setPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleRowClick = (user: UserRecord) => {
    router.push(`/users/${user.id}`)
  }

  if (isPending && users.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center bg-muted p-6">
        <AppLoader spinnerClassName="size-8" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-muted p-4 md:p-6">
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load users."}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-muted p-4 md:p-6">
      <section className="min-w-0">
        <DataTable
          columns={userColumns}
          data={users}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          onRowClick={handleRowClick}
          isLoading={isPending || (isFetching && users.length === 0)}
          emptyMessage="No users found."
          className="min-w-0"
          toolbar={
            <>
              <UsersListToolbar />
              <UserToolbar
                tab={tab}
                onTabChange={handleTabChange}
                search={search}
                onSearchChange={handleSearchChange}
                onCreateAdminUser={() => setCreateOpen(true)}
              />
            </>
          }
        />
      </section>

      <CreateAdminUserDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
