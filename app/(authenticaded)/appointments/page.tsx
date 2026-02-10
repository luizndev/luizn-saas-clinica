import React from 'react'

import { PageActions, PageContainer, PageContent, PageDescription, PageHeader, PageHeaderContent, PageTitle } from '@/components/ui/page-container'
import { getAppointments } from '@/services/get-appointments'
import { getDoctors } from '@/services/get-doctors'
import { getPatients } from '@/services/get-patients'

import { AddAppointmentButton } from './_components/add-appointment-button'
import { AppointmentsTable } from './_components/appointments-table'

const AppointmentsPage = async () => {
  const appointments = await getAppointments()
  const doctors = await getDoctors()
  const patients = await getPatients()

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Agendamentos</PageTitle>
          <PageDescription>Gerencie os agendamentos da sua clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddAppointmentButton doctors={doctors} patients={patients} />
        </PageActions>
      </PageHeader>
      <PageContent>
        <AppointmentsTable appointments={appointments} doctors={doctors} patients={patients} />
      </PageContent>
    </PageContainer>
  )
}

export default AppointmentsPage
