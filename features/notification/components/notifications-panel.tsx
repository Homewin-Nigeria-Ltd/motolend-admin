"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NotificationsPanel({
  trigger,
}: {
  trigger: React.ReactNode
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-4">
        <p className="text-sm font-medium">Notifications</p>
        <p className="mt-2 text-sm text-muted-foreground">No notifications yet.</p>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
