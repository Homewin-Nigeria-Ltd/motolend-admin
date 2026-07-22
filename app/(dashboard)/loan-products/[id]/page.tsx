import { LoanProductDetailSection } from "@/features/loan-products"

type LoanProductDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function LoanProductDetailPage({
  params,
}: LoanProductDetailPageProps) {
  const { id } = await params

  return <LoanProductDetailSection productId={id} />
}
