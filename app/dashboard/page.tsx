import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import SingOutButton from "./_components/singout-button";

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

    if(clinics.length === 0) {
       redirect('/clinic-form');
    }

  return (
    <div>
        {session?.user?.email}
        {session?.user?.name}
        <SingOutButton />
    </div>
  )
}

export default DashboardPage