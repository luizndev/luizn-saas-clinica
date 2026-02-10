"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

import { db } from "@/db"
import { patientsTable } from "@/db/schema"
import { auth } from "@/lib/auth"
import { actionClient } from "@/lib/safe-action"

import { upsertPatientSchema } from "./schema"

export const upsertPatient = actionClient.schema(upsertPatientSchema).action(async ({ parsedInput: data }) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user?.clinic?.id) {
        throw new Error("Unauthorized")
    }

    const { clinic } = session.user

    await db
        .insert(patientsTable)
        .values({
            ...data,
            clinicId: clinic.id,
        })
        .onConflictDoUpdate({
            target: patientsTable.id,
            set: {
                ...data,
                clinicId: clinic.id,
            },
        })
    
    revalidatePath('/patients')
})
