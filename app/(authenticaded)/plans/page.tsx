import { PageContainer, PageContent, PageDescription,PageHeader, PageHeaderContent, PageTitle } from '@/components/ui/page-container'

import { PricingCard } from './_components/subscription-plan'

const PlansPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Planos</PageTitle>
          <PageDescription>Gerencie os planos da sua clínica</PageDescription>
        </PageHeaderContent>
      </PageHeader>
      <PageContent>
        <PricingCard />
      </PageContent>
    </PageContainer>
  )
}

export default PlansPage