"use client"

import { Input } from "@/components/ui/input"

type PermissionsSearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function PermissionsSearchInput({
  value,
  onChange,
  placeholder = "Search",
  className,
}: PermissionsSearchInputProps) {
  return (
    <Input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      icon={{ name: "search", position: "left" }}
      className={className ?? "h-10"}
    />
  )
}
