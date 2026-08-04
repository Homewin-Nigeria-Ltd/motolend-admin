import { NextResponse } from "next/server"

import { fetchCurrentUser } from "@/features/auth/utils/fetch-current-user"

export async function GET() {
  const user = await fetchCurrentUser()

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  return NextResponse.json({ user })
}
