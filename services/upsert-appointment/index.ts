"use server"

import { and, eq, ne } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

import { db } from "@/db"
import { appointmentsTable, clinicsTable, doctorsTable, patientsTable } from "@/db/schema"
import { auth } from "@/lib/auth"
import { generateConfirmationToken } from "@/lib/generate-token"
import { actionClient } from "@/lib/safe-action"
import { sendAppointmentConfirmationEmail } from "@/services/send-email"

import { upsertAppointmentSchema } from "./schema"

export const upsertAppointment = actionClient.schema(upsertAppointmentSchema).action(async ({ parsedInput: data }) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user?.clinic?.id) {
        throw new Error("Unauthorized")
    }

    const { clinic } = session.user
    const isNewAppointment = !data.id

    // Check for conflicts
    const [existingAppointment] = await db
        .select()
        .from(appointmentsTable)
        .where(
            and(
                eq(appointmentsTable.doctorId, data.doctorId),
                eq(appointmentsTable.date, data.date),
                data.id ? ne(appointmentsTable.id, data.id) : undefined
            )
        )
        .limit(1)

    if (existingAppointment) {
        throw new Error("Já existe um agendamento para este médico neste horário.")
    }

    // Generate confirmation token for new pending appointments
    const confirmationToken = isNewAppointment && data.status === 'pending' 
        ? generateConfirmationToken() 
        : undefined

    await db
        .insert(appointmentsTable)
        .values({
            ...data,
            clinicId: clinic.id,
            confirmationToken,
        })
        .onConflictDoUpdate({
            target: appointmentsTable.id,
            set: {
                ...data,
                clinicId: clinic.id,
            },
        })
    
    // Send email only for new appointments with pending status
    if (isNewAppointment && data.status === 'pending' && confirmationToken) {
        try {
            // Fetch complete appointment data for email
            const [appointmentData] = await db
                .select({
                    patientName: patientsTable.name,
                    patientEmail: patientsTable.email,
                    doctorName: doctorsTable.name,
                    doctorSpecialty: doctorsTable.specialty,
                    clinicName: clinicsTable.name,
                    appointmentPrice: doctorsTable.appointmentPriceInCents,
                })
                .from(patientsTable)
                .innerJoin(doctorsTable, eq(doctorsTable.id, data.doctorId))
                .innerJoin(clinicsTable, eq(clinicsTable.id, clinic.id))
                .where(eq(patientsTable.id, data.patientId))
                .limit(1)

            if (appointmentData) {
                const emailResult = await sendAppointmentConfirmationEmail({
                    patientName: appointmentData.patientName,
                    patientEmail: appointmentData.patientEmail,
                    doctorName: appointmentData.doctorName,
                    doctorSpecialty: appointmentData.doctorSpecialty,
                    clinicName: appointmentData.clinicName,
                    appointmentDate: data.date,
                    appointmentPrice: appointmentData.appointmentPrice,
                    confirmationToken,
                })

                if (emailResult.success) {
                    console.log('✅ Confirmation email sent successfully')
                } else {
                    console.error('⚠️ Failed to send confirmation email:', emailResult.error)
                }
            }
        } catch (error) {
            // Log error but don't fail the appointment creation
            console.error('❌ Error in email sending process:', error)
        }
    }
    
    revalidatePath('/appointments')
})
