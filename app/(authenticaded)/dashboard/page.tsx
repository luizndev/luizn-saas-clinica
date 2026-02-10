import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { useQueryStates } from "nuqs";

import { Button } from "@/components/ui/button";
import { PageActions, PageContainer, PageContent, PageDescription,PageHeader, PageHeaderContent, PageTitle } from "@/components/ui/page-container";
import { db } from "@/db";
import { usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import { DatePicker } from "./_components/data-picker";

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
    <PageContainer>
        <PageHeader>
        <PageHeaderContent>
            <PageTitle>Dashboard</PageTitle>
            <PageDescription>Visão geral da sua clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
            <DatePicker />
        </PageActions>
        </PageHeader>
        <PageContent>
        <p>Médicos</p>
        </PageContent>
    </PageContainer>
  )
}

export default DashboardPage