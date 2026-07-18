"use client"

import { useMemo } from "react"

import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import type { UserRecord } from "@/features/users/types"

type TicketAssigneeComboboxProps = {
  id?: string
  assignees: UserRecord[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function TicketAssigneeCombobox({
  id,
  assignees,
  value,
  onChange,
  placeholder = "Select agent",
  className,
  disabled = false,
}: TicketAssigneeComboboxProps) {
  const selectedAssignee = useMemo(
    () => assignees.find((assignee) => assignee.id === value) ?? null,
    [assignees, value]
  )

  return (
    <Combobox
      items={assignees}
      value={selectedAssignee}
      onValueChange={(assignee) => onChange(assignee ? assignee.id : "")}
      itemToStringLabel={(assignee) => assignee.name}
      itemToStringValue={(assignee) => assignee.id}
      isItemEqualToValue={(a, b) => a.id === b.id}
      disabled={disabled}
    >
      <ComboboxInput
        id={id}
        placeholder={placeholder}
        showClear={Boolean(value)}
        icon={{ name: "account", position: "left" }}
        disabled={disabled}
        className={className}
      />
      <ComboboxContent>
        <ComboboxEmpty>No agent found.</ComboboxEmpty>
        <ComboboxList>
          <ComboboxCollection>
            {(assignee: UserRecord) => (
              <ComboboxItem key={assignee.id} value={assignee}>
                {assignee.name}
              </ComboboxItem>
            )}
          </ComboboxCollection>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
