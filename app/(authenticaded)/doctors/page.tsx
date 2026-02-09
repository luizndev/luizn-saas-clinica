import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

import { PageActions, PageContainer, PageContent, PageDescription,PageHeader, PageHeaderContent, PageTitle } from '@/components/ui/page-container'
import { db } from '@/db'
import { doctorsTable } from '@/db/schema'
import { auth } from '@/lib/auth'

import AddDoctorButton from './_components/add-doctor-button'
import DoctorCard from './_components/doctor-card'

const DoctorsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const doctors = await db.query.doctorsTable.findMany({
    where: eq(doctorsTable.clinicId, session?.user?.clinic?.id)
  })
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
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {doctors.map((dr) => (
            <DoctorCard key={dr.id} doctor={dr} />
          ))}
        </div>
      </PageContent>
    </PageContainer>
  )
}

export default DoctorsPage