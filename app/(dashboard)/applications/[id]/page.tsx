import { ApplicationDetailSection } from "@/features/loan-applications"

type ApplicationDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function ApplicationDetailPage({
  params,
}: ApplicationDetailPageProps) {
  const { id } = await params

  return <ApplicationDetailSection applicationId={id} />
}
