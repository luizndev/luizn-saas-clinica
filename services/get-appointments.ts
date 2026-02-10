"use server"

import { eq } from "drizzle-orm"
import { headers } from "next/headers"

import { db } from "@/db"
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema"
import { auth } from "@/lib/auth"

export const getAppointments = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user?.clinic?.id) {
        throw new Error("Unauthorized")
    }

    const { clinic } = session.user

    const appointments = await db
        .select({
            id: appointmentsTable.id,
            date: appointmentsTable.date,
            status: appointmentsTable.status,
            patientId: appointmentsTable.patientId,
            patientName: patientsTable.name,
            doctorId: appointmentsTable.doctorId,
            doctorName: doctorsTable.name,
            specialty: doctorsTable.specialty,
            appointmentPriceInCents: doctorsTable.appointmentPriceInCents,
        })
        .from(appointmentsTable)
        .innerJoin(patientsTable, eq(appointmentsTable.patientId, patientsTable.id))
        .innerJoin(doctorsTable, eq(appointmentsTable.doctorId, doctorsTable.id))
        .where(eq(appointmentsTable.clinicId, clinic.id))
        .orderBy(appointmentsTable.date)

    return appointments
}
