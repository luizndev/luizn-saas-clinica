import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

import { db } from '@/db'
import { doctorsTable } from '@/db/schema'
import { auth } from '@/lib/auth'

import DoctorsPageLayout from './_components/doctors-page-layout'

const DoctorsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const doctors = await db.query.doctorsTable.findMany({
    where: eq(doctorsTable.clinicId, session?.user?.clinic?.id)
  })
  
  return <DoctorsPageLayout doctors={doctors} />
}

export default DoctorsPage