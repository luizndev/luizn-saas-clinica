import { z } from "zod";

export const upsertAppointmentSchema = z.object({
    id: z.string().uuid().optional(),
    clinicId: z.string().uuid().optional(),
    patientId: z.string().uuid({ message: "Paciente é obrigatório" }),
    doctorId: z.string().uuid({ message: "Médico é obrigatório" }),
    date: z.coerce.date({ message: "Data é obrigatória" }),
    status: z.enum(['pending', 'confirmed', 'completed']),
});

export type UpsertAppointmentSchema = z.infer<typeof upsertAppointmentSchema>
