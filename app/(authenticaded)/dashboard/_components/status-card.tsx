import { Activity,Calendar, DollarSign, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatusCardProps {
    totalRevenue: number;
    totalPatients: number;
    totalAppointments: number;
    totalDoctors: number;
    revenueChange: number;
    patientsChange: number;
    appointmentsChange: number;
    doctorsChange: number;
}

export const StatusCard = ({
    totalRevenue,
    totalPatients,
    totalAppointments,
    totalDoctors,
    revenueChange,
    patientsChange,
    appointmentsChange,
    doctorsChange
}: StatusCardProps) => {
    return (
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-start space-y-0">
                    <div className="flex flex-row items-center justify-center bg-primary/10 p-2 rounded-lg ">
                        <DollarSign className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-sm text-muted-foreground font-medium">
                        Faturamento
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {(totalRevenue / 100).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        })}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center">
                        <Badge variant={revenueChange >= 0 ? "default" : "destructive"} className={revenueChange >= 0 ? "bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 border-none shadow-none" : "bg-rose-500/15 text-rose-500 hover:bg-rose-500/25 border-none shadow-none"}>
                           {revenueChange >= 0 ? "+" : ""}{revenueChange.toFixed(1)}%
                        </Badge>
                        <span className="ml-2">em relação ao período anterior</span>
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-start space-y-0">
                    <div className="flex flex-row items-center justify-center bg-primary/10 p-2 rounded-lg ">
                        <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-sm text-muted-foreground font-medium">
                        Agendamentos
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalAppointments}</div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center">
                        <Badge variant={appointmentsChange >= 0 ? "default" : "destructive"} className={appointmentsChange >= 0 ? "bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 border-none shadow-none" : "bg-rose-500/15 text-rose-500 hover:bg-rose-500/25 border-none shadow-none"}>
                           {appointmentsChange >= 0 ? "+" : ""}{appointmentsChange.toFixed(1)}%
                        </Badge>
                        <span className="ml-2">em relação ao período anterior</span>
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-start space-y-0 text-muted-foreground">
                    <div className="flex flex-row items-center justify-center bg-primary/10 p-2 rounded-lg ">
                        <Users className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-sm text-muted-foreground font-medium">
                        Pacientes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalPatients}</div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center">
                        <Badge variant={patientsChange >= 0 ? "default" : "destructive"} className={patientsChange >= 0 ? "bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 border-none shadow-none" : "bg-rose-500/15 text-rose-500 hover:bg-rose-500/25 border-none shadow-none"}>
                           {patientsChange >= 0 ? "+" : ""}{patientsChange.toFixed(1)}%
                        </Badge>
                        <span className="ml-2">em relação ao período anterior</span>
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-start space-y-0">
                    <div className="flex flex-row items-center justify-center bg-primary/10 p-2 rounded-lg ">
                        <Activity className="text-primary" />
                    </div>
                    <CardTitle className="text-sm text-muted-foreground font-medium">
                        Médicos
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalDoctors}</div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center">
                        <Badge variant={doctorsChange >= 0 ? "default" : "destructive"} className={doctorsChange >= 0 ? "bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 border-none shadow-none" : "bg-rose-500/15 text-rose-500 hover:bg-rose-500/25 border-none shadow-none"}>
                           {doctorsChange >= 0 ? "+" : ""}{doctorsChange.toFixed(1)}%
                        </Badge>
                        <span className="ml-2">em relação ao período anterior</span>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};