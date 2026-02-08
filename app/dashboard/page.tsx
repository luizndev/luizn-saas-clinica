import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Image from "next/image";
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
    <div className="p-8">
        {session?.user?.image && (
            <Image 
                src={session.user.image} 
                alt={session.user.name || "User profile"}
                width={100}
                height={100}
                className="rounded-full"
            />
        )}
        <p>{session?.user?.email}</p>
        <p>{session?.user?.name}</p>
        <SingOutButton />
    </div>
  )
}

export default DashboardPage