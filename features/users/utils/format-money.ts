export function formatMoney(amount: number | string | null | undefined) {
  if (amount === null || amount === undefined || amount === "") {
    return "—"
  }

  const value = typeof amount === "number" ? amount : Number(amount)

  if (Number.isNaN(value)) {
    return "—"
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(value)
}
