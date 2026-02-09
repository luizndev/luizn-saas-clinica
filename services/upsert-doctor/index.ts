"use server"

import { headers } from "next/headers"

import { db } from "@/db"
import { doctorsTable } from "@/db/schema"
import { auth } from "@/lib/auth"
import { actionClient } from "@/lib/safe-action"

import { upsertDoctorSchema } from "./schema"

export const upsertDoctor = actionClient.schema(upsertDoctorSchema).action(async ({ parsedInput: data }) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user?.clinic?.id) {
        throw new Error("Unauthorized")
    }

    const { clinic } = session.user

    await db
        .insert(doctorsTable)
        .values({
            ...data,
            clinicId: clinic.id,
        })
        .onConflictDoUpdate({
            target: doctorsTable.id,
            set: {
                ...data,
                clinicId: clinic.id,
            },
        })
})
