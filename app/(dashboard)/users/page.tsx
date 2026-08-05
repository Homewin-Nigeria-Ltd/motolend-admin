import { Suspense } from "react"

import { AppLoader } from "@/components/ui/app-loader"
import { UsersListSection } from "@/features/users"

export default function UsersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-0 flex-1 items-center justify-center bg-muted p-6">
          <AppLoader spinnerClassName="size-8" />
        </div>
      }
    >
      <UsersListSection />
    </Suspense>
  )
}
