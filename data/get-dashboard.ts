import dayjs from "dayjs";
import { and, count, desc, eq, gte, lte, sql, sum } from "drizzle-orm";

import { db } from "@/db";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";

interface Params {
  from: string;
  to: string;
  session: {
    user: {
      clinic: {
        id: string;
      };
    };
  };
}

export const getDashboard = async ({ from, to, session }: Params) => {
  const startDate = dayjs(from);
  const endDate = dayjs(to);
  const daysDiff = endDate.diff(startDate, 'days');
  const previousFrom = startDate.subtract(daysDiff + 1, 'days').toDate();
  const previousTo = startDate.subtract(1, 'second').toDate();

  const chartStartDate = dayjs().subtract(90, "days").startOf("day").toDate();
  const chartEndDate = dayjs().endOf("day").toDate();

  const [
    [totalRevenue],
    [totalAppointments],
    [totalPatients],
    [totalDoctors],
    [lastRevenue],
    [lastAppointments],
    [lastPatients],
    [lastDoctors],
    topDoctors,
    topSpecialties,
    todayAppointments,
    dailyAppointmentsData,
  ] = await Promise.all([
    db
      .select({
        total: sum(doctorsTable.appointmentPriceInCents),
      })
      .from(appointmentsTable)
      .innerJoin(doctorsTable, eq(appointmentsTable.doctorId, doctorsTable.id))
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
        ),
      ),
    db
      .select({
        total: count(),
      })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
        ),
      ),
    db
      .select({
        total: count(),
      })
      .from(patientsTable)
      .where(
        and(
          eq(patientsTable.clinicId, session.user.clinic.id),
          lte(patientsTable.createdAt, new Date(to))
        )
      ),
    db
      .select({
        total: count(),
      })
      .from(doctorsTable)
      .where(
        and(
            eq(doctorsTable.clinicId, session.user.clinic.id),
            lte(doctorsTable.createdAt, new Date(to))
        )
    ),
    // Previous period
    db
      .select({
        total: sum(doctorsTable.appointmentPriceInCents),
      })
      .from(appointmentsTable)
      .innerJoin(doctorsTable, eq(appointmentsTable.doctorId, doctorsTable.id))
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, previousFrom),
          lte(appointmentsTable.date, previousTo),
        ),
      ),
    db
      .select({
        total: count(),
      })
      .from(appointmentsTable)
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, previousFrom),
          lte(appointmentsTable.date, previousTo),
        ),
      ),
    db
      .select({
        total: count(),
      })
      .from(patientsTable)
      .where(
        and(
            eq(patientsTable.clinicId, session.user.clinic.id),
            lte(patientsTable.createdAt, previousTo)
        )
      ),
    db
      .select({
        total: count(),
      })
      .from(doctorsTable)
      .where(
        and(
            eq(doctorsTable.clinicId, session.user.clinic.id),
            lte(doctorsTable.createdAt, previousTo)
        )
      ),
    db
      .select({
        id: doctorsTable.id,
        name: doctorsTable.name,
        avatarImageUrl: doctorsTable.avatarImageUrl,
        specialty: doctorsTable.specialty,
        appointments: count(appointmentsTable.id),
      })
      .from(doctorsTable)
      .leftJoin(
        appointmentsTable,
        and(
          eq(appointmentsTable.doctorId, doctorsTable.id),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
        ),
      )
      .where(eq(doctorsTable.clinicId, session.user.clinic.id))
      .groupBy(doctorsTable.id)
      .orderBy(desc(count(appointmentsTable.id)))
      .limit(5),
    db
      .select({
        specialty: doctorsTable.specialty,
        appointments: count(appointmentsTable.id),
      })
      .from(appointmentsTable)
      .innerJoin(doctorsTable, eq(appointmentsTable.doctorId, doctorsTable.id))
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, new Date(from)),
          lte(appointmentsTable.date, new Date(to)),
        ),
      )
      .groupBy(doctorsTable.specialty)
      .orderBy(desc(count(appointmentsTable.id)))
      .limit(5),
    db.query.appointmentsTable.findMany({
      where: eq(appointmentsTable.clinicId, session.user.clinic.id),
      orderBy: [desc(appointmentsTable.date)],
      limit: 10,
      with: {
        patient: true,
        doctor: true,
      },
    }),
    db
      .select({
        date: sql<string>`DATE(${appointmentsTable.date})`.as("date"),
        appointments: count(appointmentsTable.id),
        revenue:
          sql<number>`COALESCE(SUM(${doctorsTable.appointmentPriceInCents}), 0)`.as(
            "revenue",
          ),
      })
      .from(appointmentsTable)
      .innerJoin(doctorsTable, eq(appointmentsTable.doctorId, doctorsTable.id))
      .where(
        and(
          eq(appointmentsTable.clinicId, session.user.clinic.id),
          gte(appointmentsTable.date, chartStartDate),
          lte(appointmentsTable.date, chartEndDate),
        ),
      )
      .groupBy(sql`DATE(${appointmentsTable.date})`)
      .orderBy(sql`DATE(${appointmentsTable.date})`),
  ]);

  const filledDailyAppointmentsData = [];
  const dailyDataMap = new Map(dailyAppointmentsData.map((item) => [item.date, item]));

  for (let i = 0; i <= 90; i++) {
    const date = dayjs().subtract(i, "days").format("YYYY-MM-DD");
    if (dailyDataMap.has(date)) {
      filledDailyAppointmentsData.push(dailyDataMap.get(date)!);
    } else {
      filledDailyAppointmentsData.push({
        date,
        appointments: 0,
        revenue: 0,
      });
    }
  }

  const sortedDailyAppointmentsData = filledDailyAppointmentsData.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return {
    totalRevenue,
    totalAppointments,
    totalPatients,
    totalDoctors,
    lastRevenue,
    lastAppointments,
    lastPatients,
    lastDoctors,
    topDoctors,
    topSpecialties,
    todayAppointments,
    dailyAppointmentsData: sortedDailyAppointmentsData,
  };
};