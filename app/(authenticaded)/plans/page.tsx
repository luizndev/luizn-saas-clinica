import { PageContainer, PageContent, PageDescription,PageHeader, PageHeaderContent, PageTitle } from '@/components/ui/page-container'

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
        <p>Planos</p>
      </PageContent>
    </PageContainer>
  )
}

export default PlansPage