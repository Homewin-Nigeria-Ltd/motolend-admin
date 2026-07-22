import { RepaymentDetailSection } from "@/features/repayments"

type RepaymentDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function RepaymentDetailPage({
  params,
}: RepaymentDetailPageProps) {
  const { id } = await params

  return <RepaymentDetailSection repaymentId={id} />
}
