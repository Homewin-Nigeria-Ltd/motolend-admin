import { UpdateLoanProductSection } from "@/features/loan-products"

type UpdateLoanProductPageProps = {
  params: Promise<{ id: string }>
}

export default async function UpdateLoanProductPage({
  params,
}: UpdateLoanProductPageProps) {
  const { id } = await params

  return <UpdateLoanProductSection productId={id} />
}
