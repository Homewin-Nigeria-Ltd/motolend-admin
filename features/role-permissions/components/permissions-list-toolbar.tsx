"use client"

import { Button } from "@/components/ui/button"

type PermissionsListToolbarProps = {
  onCreateClick: () => void
}

export function PermissionsListToolbar({
  onCreateClick,
}: PermissionsListToolbarProps) {
  return (
    <div className="flex justify-end">
      <Button
        type="button"
        className="h-10 shrink-0 rounded px-4"
        icon={{ name: "add", position: "left" }}
        onClick={onCreateClick}
      >
        Create Role
      </Button>
    </div>
  )
}
