import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { auth } from "@/lib/auth"

import { AppSidebar } from "./_components/app-sidebar"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/auth')
  }

  const user = {
    id: session.user.id,
    name: session.user.name || "User",
    email: session.user.email || "",
    image: session.user.image || "",
  }

  const clinic = session.user.clinic || null

  return (
    <SidebarProvider>
      <AppSidebar user={user} clinic={clinic} />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}