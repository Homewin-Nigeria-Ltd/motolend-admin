const loanProductsPath = "/admin/loan-products"

export const loanProductServerEndpoints = {
  metrics: `${loanProductsPath}/metrics`,
  list: loanProductsPath,
  create: loanProductsPath,
  detail: (id: string) => `${loanProductsPath}/${encodeURIComponent(id)}`,
  update: (id: string) => `${loanProductsPath}/${encodeURIComponent(id)}`,
  delete: (id: string) => `${loanProductsPath}/${encodeURIComponent(id)}`,
} as const

export const loanProductEndpoints = {
  metrics: `/api/proxy${loanProductsPath}/metrics`,
  list: `/api/proxy${loanProductsPath}`,
  create: `/api/proxy${loanProductsPath}`,
  detail: (id: string) =>
    `/api/proxy${loanProductsPath}/${encodeURIComponent(id)}`,
} as const
