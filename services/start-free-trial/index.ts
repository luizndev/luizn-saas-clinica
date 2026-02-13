"use server"

import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import dayjs from "dayjs"

import { db } from "@/db"
import { usersTable } from "@/db/schema"
import { auth } from "@/lib/auth"
import { actionClient } from "@/lib/safe-action"

export const startFreeTrial = actionClient.action(async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user?.id) {
        throw new Error("Unauthorized")
    }

    const user = await db.query.usersTable.findFirst({
        where: eq(usersTable.id, session.user.id),
    })

    if (!user) {
        throw new Error("User not found")
    }

    if (user.hasUsedTrial || user.plan !== "free") {
        throw new Error("User not eligible for free trial")
    }

    const trialExpiresAt = dayjs().add(14, 'days').toDate()

    await db
        .update(usersTable)
        .set({
            plan: "essential",
            trialExpiresAt,
            hasUsedTrial: true,
            updatedAt: new Date(),
        })
        .where(eq(usersTable.id, session.user.id))

    revalidatePath('/')
    revalidatePath('/subscription')
    
    return { success: true, trialExpiresAt }
})
