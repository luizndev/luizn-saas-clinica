import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { ModeToggle } from "@/components/mode-toggle"
import { Separator } from "@/components/ui/separator"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { auth } from "@/lib/auth"

import { AppSidebar } from "./_components/app-sidebar"
import { Breadcrumbs } from "./_components/breadcrumbs"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/auth')
  }

  if (session?.user.plan === "free") {
    redirect('/subscription')
  }

  const trialExpiresAt = (session?.user as any).trialExpiresAt
  if (trialExpiresAt && new Date(trialExpiresAt) < new Date()) {
    redirect('/subscription')
  }

  const user = {
    id: session.user.id,
    name: session.user.name || "User",
    email: session.user.email || "",
    image: session.user.image || "",
    plan: session.user.plan || "",
    trialExpiresAt: (session.user as any).trialExpiresAt,
  }

  const clinic = session.user.clinic || null

  return (
    <SidebarProvider>
      <AppSidebar user={user} clinic={clinic} />
      <div className="flex flex-col w-full">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 p-2" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumbs />
          </div>
          <div className="pr-4">
            <ModeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 pt-0">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}