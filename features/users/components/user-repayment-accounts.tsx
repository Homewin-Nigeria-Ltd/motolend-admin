"use client"

import { useState } from "react"

import { Icons } from "@/components/ui/icons"
import type { UserRepaymentAccount } from "@/features/users/types"
import { cn } from "@/lib/utils"

type UserRepaymentAccountsProps = {
  accounts: UserRepaymentAccount[]
}

function RepaymentAccountCard({ account }: { account: UserRepaymentAccount }) {
  const [copied, setCopied] = useState(false)
  const fullAccount = `${account.accountNumber} ${account.bankName}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullAccount)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="flex w-full items-center gap-3 rounded-2xl border border-border bg-background p-4">
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-full",
          account.variant === "success"
            ? "bg-emerald-50 text-emerald-600"
            : "bg-red-50 text-red-500",
        )}
      >
        <Icons.revenue size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {account.accountNumber} {account.bankName}
        </p>
        <p className="text-xs text-muted-foreground">Repayment Account</p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy account number"}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        {copied ? <Icons.check size={16} /> : <Icons.copy size={16} />}
      </button>
    </div>
  )
}

export function UserRepaymentAccounts({ accounts }: UserRepaymentAccountsProps) {
  if (accounts.length === 0) return null

  return (
    <div className="flex w-full flex-col gap-3">
      {accounts.map((account) => (
        <RepaymentAccountCard key={account.id} account={account} />
      ))}
    </div>
  )
}
