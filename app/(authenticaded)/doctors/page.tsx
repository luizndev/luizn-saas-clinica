import { PageActions, PageContainer, PageContent, PageDescription,PageHeader, PageHeaderContent, PageTitle } from '@/components/ui/page-container'

import AddDoctorButton from './_components/add-doctor-button'

const DoctorsPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>Gerencie os médicos da sua clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddDoctorButton />
        </PageActions>
      </PageHeader>
      <PageContent>
        <p>Médicos</p>
      </PageContent>
    </PageContainer>
  )
}

export default DoctorsPage