"use client"

type RoleDetailHeaderProps = {
  name: string
  description: string
}

export function RoleDetailHeader({ name, description }: RoleDetailHeaderProps) {
  return (
    <div className="max-w-3xl space-y-2">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        {name}
      </h2>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  )
}
