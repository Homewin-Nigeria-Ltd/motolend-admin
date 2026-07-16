import { TicketDetailSection } from "@/features/customer-support"

type TicketDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function TicketDetailPage({ params }: TicketDetailPageProps) {
  const { id } = await params

  return <TicketDetailSection ticketId={id} />
}
