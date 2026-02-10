"use server"

import { eq } from "drizzle-orm"
import { headers } from "next/headers"

import { db } from "@/db"
import { doctorsTable } from "@/db/schema"
import { auth } from "@/lib/auth"

export const getDoctors = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user?.clinic?.id) {
        throw new Error("Unauthorized")
    }

    const { clinic } = session.user

    return await db.select({
        id: doctorsTable.id,
        name: doctorsTable.name,
        specialty: doctorsTable.specialty,
        appointmentPriceInCents: doctorsTable.appointmentPriceInCents,
        availableFromTime: doctorsTable.availableFromTime,
        availableToTime: doctorsTable.availableToTime,
        availableFromWeekDay: doctorsTable.availableFromWeekDay,
        availableToWeekDay: doctorsTable.availableToWeekDay,
    }).from(doctorsTable).where(eq(doctorsTable.clinicId, clinic.id))
}
