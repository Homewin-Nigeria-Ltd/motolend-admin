"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { DataTable } from "@/components/data-table"
import { userColumns } from "@/features/users/columns"
import { CreateAdminUserDialog } from "@/features/users/components/create-admin-user-dialog"
import { UserSummaryCards } from "@/features/users/components/user-summary-cards"
import { UserToolbar } from "@/features/users/components/user-toolbar"
import { useUserList } from "@/features/users/hooks/use-user-list"
import { useUserMetrics } from "@/features/users/hooks/use-user-metrics"
import type { UserRecord, UserTab } from "@/features/users/types"

const PAGE_SIZE = 15

export function UsersOverviewSection() {
  const router = useRouter()
  const [tab, setTab] = useState<UserTab>("active")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)

  const {
    data: metrics,
    isPending: isMetricsPending,
    isError: isMetricsError,
    error: metricsError,
  } = useUserMetrics()

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

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 bg-muted p-4 md:gap-8 md:p-6">
      {isMetricsError ? (
        <div className="rounded-2xl border border-border bg-background p-4 text-sm text-destructive">
          {metricsError instanceof Error
            ? metricsError.message
            : "Failed to load user metrics."}
        </div>
      ) : (
        <UserSummaryCards
          kpis={metrics ?? []}
          isLoading={isMetricsPending}
        />
      )}

      {isError ? (
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load users."}
        </div>
      ) : (
        <DataTable
          columns={userColumns}
          data={users}
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          onRowClick={handleRowClick}
          isLoading={isPending || (isFetching && users.length === 0)}
          emptyMessage="No users found."
          toolbar={
            <UserToolbar
              tab={tab}
              onTabChange={handleTabChange}
              search={search}
              onSearchChange={handleSearchChange}
              onCreateAdminUser={() => setCreateOpen(true)}
              showViewAllUsers
            />
          }
        />
      )}

      <CreateAdminUserDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
