"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { z } from "zod"

import { db } from "@/db"
import { appointmentsTable } from "@/db/schema"
import { auth } from "@/lib/auth"
import { actionClient } from "@/lib/safe-action"

const deleteAppointmentSchema = z.object({
  id: z.string().uuid(),
})

export const deleteAppointment = actionClient
  .schema(deleteAppointmentSchema)
  .action(async ({ parsedInput: { id } }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.clinic?.id) {
      throw new Error("Unauthorized")
    }

    const { clinic } = session.user

    // Verify appointment belongs to clinic before deleting
    const [appointment] = await db
      .select()
      .from(appointmentsTable)
      .where(eq(appointmentsTable.id, id))
      .limit(1)

    if (!appointment || appointment.clinicId !== clinic.id) {
      throw new Error("Appointment not found or unauthorized")
    }

    await db.delete(appointmentsTable).where(eq(appointmentsTable.id, id))

    revalidatePath("/appointments")

    return { success: true }
  })
