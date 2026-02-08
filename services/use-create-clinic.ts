'use server';

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { clinicsTable, usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const createClinic = async (name: string) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const clinicId = crypto.randomUUID();
    const [clinic] = await db.insert(clinicsTable).values({ id: clinicId, name }).returning();
    await db.insert(usersToClinicsTable).values({
        userId: session.user.id,
        clinicId,
    });
    redirect('/dashboard');
}
