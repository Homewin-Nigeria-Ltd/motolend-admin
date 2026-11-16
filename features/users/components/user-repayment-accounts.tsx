"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import type { UserBankAccount } from "@/features/users/types"
import { cn } from "@/lib/utils"

type UserRepaymentAccountsProps = {
  accounts: UserBankAccount[]
}

function BankAccountCard({ account }: { account: UserBankAccount }) {
  const [copied, setCopied] = useState(false)
  const copyValue = [
    account.accountNumber,
    account.bankName,
    account.accountName,
  ]
    .filter((part) => part && part !== "—")
    .join(" · ")

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyValue || account.accountNumber)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">
            {account.label}
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-foreground">
            {account.accountNumber}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {account.bankName}
            {account.accountName && account.accountName !== "—"
              ? ` · ${account.accountName}`
              : ""}
          </p>
        </div>
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full",
            account.variant === "success"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-500",
          )}
        >
          <Icons.revenue size={16} />
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 w-fit px-3"
        onClick={handleCopy}
        icon={{ name: copied ? "check" : "copy", position: "left" }}
      >
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  )
}

export function UserRepaymentAccounts({ accounts }: UserRepaymentAccountsProps) {
  if (accounts.length === 0) {
    return null
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {accounts.map((account) => (
        <BankAccountCard key={account.id} account={account} />
      ))}
    </div>
  )
}
