import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { clinicsTable, usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";


const DashboardPage = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    console.log(session);
    if (!session?.user?.id) {
        redirect('/auth');
    }

    const clinics = await db.query.usersToClinicsTable.findMany({
        where: eq(usersToClinicsTable.userId, session.user.id),
    })

    console.log(clinics);

    if(clinics.length === 0) {
       redirect('/clinic-form');
    }

  return (
    <div className="p-8">
       
    </div>
  )
}

export default DashboardPage