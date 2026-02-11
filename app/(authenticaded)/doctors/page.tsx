import { getDoctors } from '@/services/get-doctors'

import DoctorsPageLayout from './_components/doctors-page-layout'

const DoctorsPage = async () => {
  const doctors = await getDoctors()
  
  return <DoctorsPageLayout doctors={doctors} />
}

export default DoctorsPage