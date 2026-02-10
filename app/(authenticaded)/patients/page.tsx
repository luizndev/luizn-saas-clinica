import React from 'react'

import { PageActions, PageContainer, PageContent, PageDescription, PageHeader, PageHeaderContent, PageTitle } from '@/components/ui/page-container'
import { getPatients } from '@/services/get-patients'

import { AddPatientButton } from './_components/add-patient-button'
import { PatientsTable } from './_components/patients-table'

const PatientsPage = async () => {
  const patients = await getPatients()

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Pacientes</PageTitle>
          <PageDescription>Gerencie os pacientes da sua clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddPatientButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        <PatientsTable patients={patients} />
      </PageContent>
    </PageContainer>
  )
}

export default PatientsPage