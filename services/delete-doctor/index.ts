'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

import { db } from '@/db'
import { doctorsTable } from '@/db/schema'
import { auth } from '@/lib/auth'
import { actionClient } from '@/lib/safe-action'

import { deleteDoctorSchema } from './schema'

export const deleteDoctor = actionClient
  .schema(deleteDoctorSchema)
  .action(async ({ parsedInput: { doctorId } }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.clinic?.id) {
      throw new Error('Unauthorized')
    }

    await db
      .delete(doctorsTable)
      .where(
        and(
          eq(doctorsTable.id, doctorId),
          eq(doctorsTable.clinicId, session.user.clinic.id)
        )
      )

    revalidatePath('/doctors')

    return { success: true }
  })
