import { UserDetailSection } from "@/features/users"

type UserDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params

  return <UserDetailSection userId={id} />
}
