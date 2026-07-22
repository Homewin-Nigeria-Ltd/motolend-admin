"use client"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DeleteLoanProductDialog } from "@/features/loan-products/components/delete-loan-product-dialog"
import { EditLoanProductSheet } from "@/features/loan-products/components/edit-loan-product-sheet"
import { useUpdateLoanProduct } from "@/features/loan-products/hooks/use-loan-product-mutations"
import type { LoanProductDetail } from "@/features/loan-products/types"
import { cn } from "@/lib/utils"

type LoanProductDetailHeaderProps = {
  product: LoanProductDetail
}

function displayValue(value: string) {
  const text = value.trim()
  return text && text !== "—" ? text : "-"
}

function HeaderField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="min-w-0 shrink-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-1">{children}</div>
    </div>
  )
}

export function LoanProductDetailHeader({
  product,
}: LoanProductDetailHeaderProps) {
  const { updateLoanProduct, isPending } = useUpdateLoanProduct()

  const handleStatusChange = (value: string) => {
    const isActive = value === "active"

    if (isActive === (product.status === "active")) {
      return
    }

    void updateLoanProduct({
      id: product.id,
      is_active: isActive,
    })
  }

  return (
    <div className="rounded-2xl border border-border bg-background px-4 py-4 md:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-4">
          <HeaderField label="Loan Product Name">
            <p className="text-base font-semibold text-foreground">
              {displayValue(product.name)}
            </p>
          </HeaderField>

          <HeaderField label="Product ID">
            <p className="text-sm font-semibold text-foreground">
              {displayValue(product.productId)}
            </p>
          </HeaderField>

          <HeaderField label="Status">
            <Select
              value={product.status}
              disabled={isPending}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger
                className={cn(
                  "h-auto w-fit gap-1 rounded-full border-0 px-3 py-1 text-xs font-semibold shadow-none focus-visible:ring-0",
                  product.status === "active"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </HeaderField>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-center">
          <EditLoanProductSheet
            product={product}
            trigger={
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-10 shrink-0"
                aria-label="Edit loan product"
              >
                <Icons.edit size={18} />
              </Button>
            }
          />
          <DeleteLoanProductDialog
            productId={product.id}
            productName={displayValue(product.name)}
          />
        </div>
      </div>
    </div>
  )
}
