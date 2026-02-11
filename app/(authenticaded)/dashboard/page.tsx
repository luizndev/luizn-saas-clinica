import dayjs from "dayjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { PageActions, PageContainer, PageContent, PageDescription, PageHeader, PageHeaderContent, PageTitle } from "@/components/ui/page-container";
import { getDashboard } from "@/data/get-dashboard";
import { auth } from "@/lib/auth";

import { ChartRevenue } from "./_components/chart-revenue";
import { DatePicker } from "./_components/data-picker";
import RecentAppointments from "./_components/recent-appointments";
import { StatusCard } from "./_components/status-card";
import TopDoctors from "./_components/top-doctor";
import TopSpecialties from "./_components/top-especialities";

interface DashboardPageProps {
    searchParams: {
        from: string;
        to: string;
    }
}

const DashboardPage = async ({searchParams}: DashboardPageProps) => {
    const { from, to } = await searchParams;
    if(!from || !to) {
        redirect(`/dashboard?from=${dayjs().subtract(90, 'days').format('YYYY-MM-DD')}&to=${dayjs().add(1, 'month').format('YYYY-MM-DD')}`);
    }
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        redirect('/auth');
    }

    if (!session?.user?.clinic?.id) {
        redirect('/clinic-form');
    }

    const dashboardData = await getDashboard({
        from,
        to,
        session: session as any
    });

    const calculateChange = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
    };

    const revenueChange = calculateChange(Number(dashboardData.totalRevenue?.total || 0), Number(dashboardData.lastRevenue?.total || 0));
    const patientsChange = calculateChange(dashboardData.totalPatients?.total || 0, dashboardData.lastPatients?.total || 0);
    const appointmentsChange = calculateChange(dashboardData.totalAppointments?.total || 0, dashboardData.lastAppointments?.total || 0);
    const doctorsChange = calculateChange(dashboardData.totalDoctors?.total || 0, dashboardData.lastDoctors?.total || 0);

     const chartData = dashboardData.dailyAppointmentsData.map(item => ({
        ...item,
        revenue: item.revenue / 100
    }));

  return (
    <PageContainer>
        <PageHeader>
        <PageHeaderContent>
            <PageTitle>Dashboard</PageTitle>
            <PageDescription>Visão geral do seu negócio</PageDescription>
        </PageHeaderContent>
        <PageActions>
            <DatePicker />
        </PageActions>
        </PageHeader>
        <PageContent>
            <div className="flex flex-col gap-6">
                <StatusCard 
                    totalRevenue={Number(dashboardData.totalRevenue?.total || 0)}
                    totalPatients={dashboardData.totalPatients?.total || 0}
                    totalAppointments={dashboardData.totalAppointments?.total || 0}
                    totalDoctors={dashboardData.totalDoctors?.total || 0}
                    revenueChange={revenueChange}
                    patientsChange={patientsChange}
                    appointmentsChange={appointmentsChange}
                    doctorsChange={doctorsChange}
                />
                
                <div className="grid grid-cols-[2.25fr_1fr] gap-6">
                     <ChartRevenue data={chartData} />
                     <TopDoctors doctors={dashboardData.topDoctors} />
                </div>

                 <div className="grid grid-cols-[2.25fr_1fr] gap-6">
                    <RecentAppointments appointments={dashboardData.todayAppointments} />
                    <TopSpecialties topSpecialties={dashboardData.topSpecialties} />
                </div>
            </div>
        </PageContent>
    </PageContainer>
  )
}

export default DashboardPage