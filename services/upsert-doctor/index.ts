"use server"

import dayjs from "dayjs"
import utc from 'dayjs/plugin/utc'
import { headers } from "next/headers"

import { db } from "@/db"
import { doctorsTable } from "@/db/schema"
import { auth } from "@/lib/auth"
import { actionClient } from "@/lib/safe-action"

dayjs.extend(utc)

import { revalidatePath } from "next/cache"

import { upsertDoctorSchema } from "./schema"

export const upsertDoctor = actionClient.schema(upsertDoctorSchema).action(async ({ parsedInput: data }) => {
    const availableFromTimeUTC = dayjs().set('hour', Number(data.availableFromTime.split(':')[0])).set('minute', Number(data.availableFromTime.split(':')[1])).set('second', Number(data.availableFromTime.split(':')[2])).utc()
    const availableToTimeUTC = dayjs().set('hour', Number(data.availableToTime.split(':')[0])).set('minute', Number(data.availableToTime.split(':')[1])).set('second', Number(data.availableToTime.split(':')[2])).utc()
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
            availableFromTime: availableFromTimeUTC.format("HH:mm:ss"),
            availableToTime: availableToTimeUTC.format("HH:mm:ss"),
        })
        .onConflictDoUpdate({
            target: doctorsTable.id,
            set: {
                ...data,
                clinicId: clinic.id,
            },
        })
        revalidatePath('/doctors')
})
