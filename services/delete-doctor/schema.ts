import { z } from 'zod'

export const deleteDoctorSchema = z.object({
  doctorId: z.string().uuid('ID de médico inválido'),
})
