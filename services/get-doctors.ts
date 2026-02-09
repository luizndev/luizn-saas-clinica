import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { z } from "zod"

import { db } from "@/db"
import { doctorsTable } from "@/db/schema"
import { auth } from "@/lib/auth"
import { actionClient } from "@/lib/safe-action"

export const getDoctors = actionClient.schema(z.object({})).action(async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user?.clinic?.id) {
        throw new Error("Unauthorized")
    }

    const { clinic } = session.user

    const doctors = await db.select().from(doctorsTable).where(eq(doctorsTable.clinicId, clinic.id))

    return doctors
})