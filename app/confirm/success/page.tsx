import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, CheckCircle2, Clock, MapPin, Stethoscope, User } from 'lucide-react'
import Image from 'next/image'

export default async function ConfirmSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    already?: string
    patient?: string
    clinic?: string
    doctor?: string
    specialty?: string
    date?: string
  }>
}) {
  const params = await searchParams
  const appointmentDate = params.date ? new Date(params.date) : null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary/10 gap-5 p-4">
      <Image src="/agendafacil-color.svg" alt="Logo" width={280} height={280} />
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-blue-100 p-4">
            <CheckCircle2 className="w-16 h-16 text-blue-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          {params.already ? 'Agendamento Já Confirmado!' : 'Agendamento Confirmado!'}
        </h1>

        <p className="text-gray-600 mb-6 text-center leading-relaxed">
          {params.already ? (
            'Este agendamento já foi confirmado anteriormente.'
          ) : params.patient && params.doctor && params.clinic && appointmentDate ? (
            <>
              Olá, <strong>{params.patient}</strong>! Seu agendamento na{' '}
              <strong>{params.clinic}</strong> está marcado para o dia{' '}
              <strong>{format(appointmentDate, "dd 'de' MMMM", { locale: ptBR })}</strong> às{' '}
              <strong>{format(appointmentDate, "HH:mm", { locale: ptBR })}</strong> e você irá passar pelo{' '}
              {params.specialty ? `${params.specialty.toLowerCase()} ` : 'médico '}
              <strong>{params.doctor}</strong>. A clínica já foi notificada e está aguardando você!
            </>
          ) : (
            'Seu agendamento foi confirmado com sucesso. A clínica já foi notificada e está aguardando você na data e horário marcados.'
          )}
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Próximos passos:</strong>
            <br />
            Compareça na data e horário agendados. Em caso de imprevistos, entre em contato com a clínica.
          </p>
        </div>

        <div className="text-sm text-gray-500 text-center">
          Você pode fechar esta página agora.
        </div>
      </div>
    </div>
  )
}
