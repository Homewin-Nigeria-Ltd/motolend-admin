import { EditTenureSection } from "@/features/tenures"

type EditTenurePageProps = {
  params: Promise<{ id: string }>
}

export default async function EditTenurePage({ params }: EditTenurePageProps) {
  const { id } = await params
  return <EditTenureSection tenureId={id} />
}
