export type DeclineRecord = {
  id: string
  createdAt: string
  customerName: string
  amountRequested: string
  loanProductApproved: string
  reasonForDecline: string
}

export type DeclineListParams = {
  page: number
  per_page?: number
  search?: string
}

export type DeclineListMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type DeclineListResponse = {
  items: DeclineRecord[]
  meta: DeclineListMeta
}
