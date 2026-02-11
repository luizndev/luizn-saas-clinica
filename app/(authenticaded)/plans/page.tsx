import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from '@/components/ui/page-container'
import { auth } from '@/lib/auth'

import { PricingCard } from './_components/subscription-plan'

const PlansPage = async () => {
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
    plan: session.user.plan || "",
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Planos</PageTitle>
          <PageDescription>Gerencie os planos da sua clínica</PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <PricingCard active={user.plan === "essential"} userEmail={user.email} />
      </PageContent>
    </PageContainer>
  )
}

export default PlansPage
