import { z } from "zod";

export const upsertDoctorSchema = z.object({
    id: z.string().uuid().optional(),
    clinicId: z.string().uuid().optional(),
    name: z.string().trim().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
    specialty: z.string().trim().min(3).max(100),
    avatarImageUrl: z.string().url('URL inválida').optional().or(z.literal("")),
    availableFromWeekDay: z.number().min(0).max(6),
    availableToWeekDay: z.number().min(0).max(6),
    availableFromTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Formato de hora inválido'),
    availableToTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Formato de hora inválido'),
    appointmentPriceInCents: z.number().min(0, 'Preço deve ser maior que 0'),
}).refine((data) => {
    return data.availableToTime > data.availableFromTime;
}, {
    message: 'O Horario de inicio não pode ser anterior ao horario de termino',
    path: ['availableToTime'],
})


export type UpsertDoctorSchema = z.infer<typeof upsertDoctorSchema>