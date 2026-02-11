import {
  Activity,
  Baby,
  Bone,
  Brain,
  Eye,
  Hand,
  Heart,
  Hospital,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TopSpecialtiesProps {
  topSpecialties: {
    specialty: string;
    appointments: number;
  }[];
}

const getSpecialtyIcon = (specialty: string) => {
  const specialtyLower = specialty.toLowerCase();

  if (specialtyLower.includes("cardiolog")) return Heart;
  if (
    specialtyLower.includes("ginecolog") ||
    specialtyLower.includes("obstetri")
  )
    return Baby;
  if (specialtyLower.includes("pediatr")) return Activity;
  if (specialtyLower.includes("dermatolog")) return Hand;
  if (
    specialtyLower.includes("ortoped") ||
    specialtyLower.includes("traumatolog")
  )
    return Bone;
  if (specialtyLower.includes("oftalmolog")) return Eye;
  if (specialtyLower.includes("neurolog")) return Brain;

  return Stethoscope;
};

export default function TopSpecialties({
  topSpecialties,
}: TopSpecialtiesProps) {
  const maxAppointments =
    topSpecialties.length > 0
      ? Math.max(...topSpecialties.map((i) => i.appointments))
      : 0;

  return (
    <Card className="mx-auto w-full">
      <CardContent>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Hospital className="h-5 w-5 text-gray-500" />
            <CardTitle className="text-lg text-gray-800">
              Especialidades
            </CardTitle>
          </div>
          <Link
            href="/appointments"
            className="text-xs font-medium text-gray-500 hover:underline"
          >
            Ver todos
          </Link>
        </div>

        {/* specialties list */}
        <div className="space-y-6">
          {topSpecialties.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-6">
              Sem especialidades cadastradas
            </p>
          ) : (
            topSpecialties.map((specialty) => {
              const Icon = getSpecialtyIcon(specialty.specialty);

              const progressValue =
                maxAppointments > 0
                  ? (specialty.appointments / maxAppointments) * 100
                  : 0;

              return (
                <div
                  key={specialty.specialty}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 min-w-10 items-center justify-center rounded-full bg-blue-500/10">
                    <Icon className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex w-full flex-col gap-1">
                    <div className="flex w-full items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-700">
                        {specialty.specialty}
                      </h3>
                      <span className="text-xs font-medium text-gray-500">
                        {specialty.appointments} agend.
                      </span>
                    </div>
                    <Progress
                      value={progressValue}
                      className="h-1.5 w-full bg-gray-100 [&>div]:bg-blue-600"
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
