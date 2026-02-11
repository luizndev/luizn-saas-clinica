import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

import PlansClient from "./PlansClient"

interface PlansPageProps {
  active?: boolean
}

export default async function PlansPage({ active = false }: PlansPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect("/auth")
  }

  return <PlansClient active={active} userEmail={session.user.email} />
}
