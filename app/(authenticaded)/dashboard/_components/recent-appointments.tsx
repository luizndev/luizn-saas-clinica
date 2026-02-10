import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RecentAppointmentsProps {
  appointments: {
    id: string;
    date: Date;
    status: string;
    patient: {
      name: string;
    };
    doctor: {
      name: string;
      avatarImageUrl: string | null;
    };
  }[];
}

export default function RecentAppointments({
  appointments,
}: RecentAppointmentsProps) {
  return (
    <Card className="">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <CardTitle className="text-lg">Agendamentos</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="pl-0 text-xs font-semibold uppercase text-gray-400">PACIENTE</TableHead>
              <TableHead className="text-xs font-semibold uppercase text-gray-400">DATA</TableHead>
              <TableHead className="text-xs font-semibold uppercase text-gray-400">DOUTOR</TableHead>
              <TableHead className="text-xs font-semibold uppercase text-gray-400">STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id} className="border-b-gray-100">
                <TableCell className="pl-0 font-medium text-gray-700">
                  {appointment.patient.name}
                </TableCell>
                <TableCell className="text-gray-600">
                  {format(new Date(appointment.date), "dd/MM/yy, HH:mm", {
                    locale: ptBR,
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-100 text-xs font-medium text-gray-600">
                        {appointment.doctor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">
                      {appointment.doctor.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`flex w-fit items-center gap-2 border-none px-2.5 py-0.5 text-xs font-semibold shadow-none ${
                        appointment.status === "confirmed"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : appointment.status === "completed"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <div className={`h-1.5 w-1.5 rounded-full ${
                        appointment.status === "confirmed"
                        ? "bg-emerald-500"
                        : appointment.status === "completed"
                          ? "bg-blue-500"
                          : "bg-gray-500"
                    }`} />
                    {appointment.status === "confirmed"
                      ? "Confirmado"
                      : appointment.status === "completed"
                        ? "Finalizado"
                        : "Pendente"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {appointments.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-6 text-center text-sm text-gray-500"
                >
                  Nenhum agendamento recente.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
