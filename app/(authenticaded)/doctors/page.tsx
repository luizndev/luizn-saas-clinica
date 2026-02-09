import React from 'react'

import { Button } from '@/components/ui/button'
import { PageActions, PageContainer, PageContent, PageDescription,PageHeader, PageHeaderContent, PageTitle } from '@/components/ui/page-container'

const DoctorsPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>Gerencie os médicos da sua clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <Button>Adicionar médico</Button>
        </PageActions>
      </PageHeader>
      <PageContent>
        <p>Médicos</p>
      </PageContent>
    </PageContainer>
  )
}

export default DoctorsPage