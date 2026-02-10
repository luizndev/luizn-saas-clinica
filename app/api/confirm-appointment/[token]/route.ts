import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

import { db } from "@/db"
import { appointmentsTable, clinicsTable, doctorsTable, patientsTable } from "@/db/schema"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    if (!token) {
      return NextResponse.redirect(new URL('/confirm/error', request.url))
    }

    const [appointmentData] = await db
      .select({
        id: appointmentsTable.id,
        date: appointmentsTable.date,
        status: appointmentsTable.status,
        patientName: patientsTable.name,
        doctorName: doctorsTable.name,
        doctorSpecialty: doctorsTable.specialty,
        clinicName: clinicsTable.name,
      })
      .from(appointmentsTable)
      .innerJoin(patientsTable, eq(appointmentsTable.patientId, patientsTable.id))
      .innerJoin(doctorsTable, eq(appointmentsTable.doctorId, doctorsTable.id))
      .innerJoin(clinicsTable, eq(appointmentsTable.clinicId, clinicsTable.id))
      .where(eq(appointmentsTable.confirmationToken, token))
      .limit(1)

    if (!appointmentData) {
      return NextResponse.redirect(new URL('/confirm/error', request.url))
    }

    if (appointmentData.status === 'confirmed') {
      const successUrl = new URL('/confirm/success', request.url)
      successUrl.searchParams.set('already', 'true')
      successUrl.searchParams.set('patient', appointmentData.patientName)
      successUrl.searchParams.set('clinic', appointmentData.clinicName)
      successUrl.searchParams.set('doctor', appointmentData.doctorName)
      successUrl.searchParams.set('specialty', appointmentData.doctorSpecialty)
      successUrl.searchParams.set('date', appointmentData.date.toISOString())
      return NextResponse.redirect(successUrl)
    }

    await db
      .update(appointmentsTable)
      .set({
        status: 'confirmed',
        confirmedAt: new Date(),
      })
      .where(eq(appointmentsTable.id, appointmentData.id))

    console.log(`✅ Appointment ${appointmentData.id} confirmed successfully`)

    const successUrl = new URL('/confirm/success', request.url)
    successUrl.searchParams.set('patient', appointmentData.patientName)
    successUrl.searchParams.set('clinic', appointmentData.clinicName)
    successUrl.searchParams.set('doctor', appointmentData.doctorName)
    successUrl.searchParams.set('specialty', appointmentData.doctorSpecialty)
    successUrl.searchParams.set('date', appointmentData.date.toISOString())
    
    return NextResponse.redirect(successUrl)
  } catch (error) {
    console.error('❌ Error confirming appointment:', error)
    return NextResponse.redirect(new URL('/confirm/error', request.url))
  }
}
