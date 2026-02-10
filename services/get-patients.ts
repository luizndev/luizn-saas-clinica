"use server"

import { eq } from "drizzle-orm"
import { headers } from "next/headers"

import { db } from "@/db"
import { patientsTable } from "@/db/schema"
import { auth } from "@/lib/auth"

export const getPatients = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user?.clinic?.id) {
        throw new Error("Unauthorized")
    }

    const { clinic } = session.user

    const patients = await db
        .select()
        .from(patientsTable)
        .where(eq(patientsTable.clinicId, clinic.id))
        .orderBy(patientsTable.createdAt)

    return patients
}
