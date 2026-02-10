import { z } from "zod";

export const upsertPatientSchema = z.object({
    id: z.string().uuid().optional(),
    clinicId: z.string().uuid().optional(),
    name: z.string().trim().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
    email: z.string().email('E-mail inválido').trim(),
    phoneNumber: z.string().min(1, 'Telefone é obrigatório'),
    sex: z.enum(['male', 'female', 'other']),
});

export type UpsertPatientSchema = z.infer<typeof upsertPatientSchema>
