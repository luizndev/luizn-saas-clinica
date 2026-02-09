import React from 'react'

import { Button } from '@/components/ui/button'
import { PageActions, PageContainer, PageContent, PageDescription,PageHeader, PageHeaderContent, PageTitle } from '@/components/ui/page-container'

const PatientsPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Pacientes</PageTitle>
          <PageDescription>Gerencie os pacientes da sua clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <Button>Adicionar paciente</Button>
        </PageActions>
      </PageHeader>
      <PageContent>
        <p>Pacientes</p>
      </PageContent>
    </PageContainer>
  )
}

export default PatientsPage