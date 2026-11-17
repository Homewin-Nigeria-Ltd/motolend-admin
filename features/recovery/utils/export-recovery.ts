import { recoveryEndpoints } from "@/features/recovery/api/endpoints"
import type { RecoveryListParams } from "@/features/recovery/types"

function buildExportUrl(params: Omit<RecoveryListParams, "page" | "per_page">) {
  const searchParams = new URLSearchParams()

  if (params.search?.trim()) {
    searchParams.set("search", params.search.trim())
  }

  if (params.stage) {
    searchParams.set("stage", params.stage)
  }

  if (params.status) {
    searchParams.set("status", params.status)
  }

  if (params.loan_product_id != null) {
    searchParams.set("loan_product_id", String(params.loan_product_id))
  }

  if (params.date_from) {
    searchParams.set("date_from", params.date_from)
  }

  if (params.date_to) {
    searchParams.set("date_to", params.date_to)
  }

  const query = searchParams.toString()
  return query
    ? `${recoveryEndpoints.export}?${query}`
    : recoveryEndpoints.export
}

function resolveFilename(contentDisposition: string | null) {
  if (!contentDisposition) {
    return `recovery-loans-${new Date().toISOString().slice(0, 10)}.csv`
  }

  const utfMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)
  if (utfMatch?.[1]) {
    return decodeURIComponent(utfMatch[1])
  }

  const plainMatch = contentDisposition.match(/filename="?([^"]+)"?/i)
  if (plainMatch?.[1]) {
    return plainMatch[1]
  }

  return `recovery-loans-${new Date().toISOString().slice(0, 10)}.csv`
}

export async function exportRecoveryLoansCsv(
  params: Omit<RecoveryListParams, "page" | "per_page">,
) {
  const response = await fetch(buildExportUrl(params), {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "text/csv,application/json",
    },
  })

  if (!response.ok) {
    let message = "Failed to export recovery loans"
    try {
      const data = (await response.json()) as { message?: string }
      if (data.message) message = data.message
    } catch {
      // ignore non-JSON error bodies
    }
    throw new Error(message)
  }

  const blob = await response.blob()
  const filename = resolveFilename(response.headers.get("content-disposition"))
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = objectUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(objectUrl)
}
