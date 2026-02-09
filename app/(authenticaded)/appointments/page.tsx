import React from 'react'

import { Button } from '@/components/ui/button'
import { PageActions, PageContainer, PageContent, PageDescription,PageHeader, PageHeaderContent, PageTitle } from '@/components/ui/page-container'

const AppointmentsPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Agendamentos</PageTitle>
          <PageDescription>Gerencie os agendamentos da sua clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <Button>Adicionar agendamento</Button>
        </PageActions>
      </PageHeader>
      <PageContent>
        <p>Agendamentos</p>
      </PageContent>
    </PageContainer>
  )
}

export default AppointmentsPage