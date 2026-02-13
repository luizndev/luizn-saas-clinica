"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

dayjs.extend(utc)
dayjs.extend(timezone)

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { upsertAppointment } from '@/services/upsert-appointment'

const formSchema = z.object({
  patientId: z.string().uuid({ message: "Paciente é obrigatório" }),
  doctorId: z.string().uuid({ message: "Médico é obrigatório" }),
  date: z.date({ message: "Data é obrigatória" }),
  status: z.enum(['pending', 'confirmed', 'completed']),
})

interface Doctor {
  id: string
  name: string
  specialty: string
  appointmentPriceInCents: number
  availableFromTime: string
  availableToTime: string
  availableFromWeekDay: number
  availableToWeekDay: number
}

interface Patient {
  id: string
  name: string
}

interface Appointment {
  id: string
  patientId: string
  doctorId: string
  date: Date
  status: 'pending' | 'confirmed' | 'completed'
}

interface UpsertAppointmentDialogProps {
  appointment?: Appointment
  doctors: Doctor[]
  patients: Patient[]
  appointments: Appointment[]
  onSuccess?: () => void
  onError?: (error: unknown) => void
  isOpen: boolean
}

export const UpsertAppointmentDialog = ({ 
  appointment, 
  doctors, 
  patients, 
  appointments,
  onSuccess, 
  onError, 
  isOpen 
}: UpsertAppointmentDialogProps) => {
  const [patientOpen, setPatientOpen] = useState(false)
  const [doctorOpen, setDoctorOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: appointment?.patientId ?? '',
      doctorId: appointment?.doctorId ?? '',
      date: appointment?.date ? new Date(appointment.date) : undefined,
      status: appointment?.status ?? 'pending',
    },
  })

  const selectedDoctorId = form.watch('doctorId')
  const selectedDoctor = useMemo(() => {
    return doctors.find(d => d.id === selectedDoctorId) || null
  }, [doctors, selectedDoctorId])

  const selectedDate = form.watch('date')

  const { availableTimeSlots, bookedSlots } = useMemo(() => {
    if (!selectedDoctor) return { availableTimeSlots: undefined, bookedSlots: [] }

    const slots: string[] = []
    const fromTime = selectedDoctor.availableFromTime
    const toTime = selectedDoctor.availableToTime 

    const [fromHour, fromMinute] = fromTime.split(':').map(Number)
    const [toHour, toMinute] = toTime.split(':').map(Number)

    const refDate = dayjs().startOf('day')
    let current = refDate.hour(fromHour).minute(fromMinute)
    const end = refDate.hour(toHour).minute(toMinute)

    while (current.isBefore(end)) {
      slots.push(current.format('HH:mm'))
      current = current.add(30, 'minute')
    }

    let busy: string[] = []

    if (selectedDate) {
      busy = appointments
        .filter(app => 
          app.doctorId === selectedDoctor.id && 
          dayjs(app.date).isSame(selectedDate, 'day') &&
          app.id !== appointment?.id
        )
        .map(app =>
          dayjs(app.date)
            .local()
            .add(3, 'hour')
            .format('HH:mm')
        )
    }


    return { availableTimeSlots: slots, bookedSlots: busy }
  }, [selectedDoctor, selectedDate, appointments, appointment])

  useEffect(() => {
    if (isOpen) {
      form.reset({
        patientId: appointment?.patientId ?? '',
        doctorId: appointment?.doctorId ?? '',
        date: appointment?.date ? new Date(appointment.date) : undefined,
        status: appointment?.status ?? 'pending',
      })
    }
  }, [isOpen, appointment, form])

  const upsertAppointmentAction = useAction(upsertAppointment, {
    onSuccess() {
      form.reset()
      onSuccess?.()
      toast.success(appointment ? 'Agendamento atualizado com sucesso' : 'Agendamento criado com sucesso')
    },
    onError(result) {
      console.log(result.error)
      onError?.(result.error)
      const errorMessage = (result.error as any).serverError || 'Erro ao salvar agendamento'
      toast.error(errorMessage)
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    upsertAppointmentAction.execute({
      ...data,
      id: appointment?.id,
    })
  }

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{appointment ? 'Editar' : 'Adicionar'} agendamento</DialogTitle>
        <DialogDescription>
          {appointment ? 'Edite' : 'Adicione'} um agendamento à sua clínica
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
          <FormField
            control={form.control}
            name='patientId'
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Paciente</FormLabel>
                <Popover open={patientOpen} onOpenChange={setPatientOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? patients.find((patient) => patient.id === field.value)?.name
                          : "Selecione um paciente"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Pesquisar paciente..." />
                      <CommandList>
                        <CommandEmpty>Nenhum paciente encontrado.</CommandEmpty>
                        <CommandGroup>
                          {patients.map((patient) => (
                            <CommandItem
                              key={patient.id}
                              value={patient.name}
                              onSelect={() => {
                                form.setValue('patientId', patient.id)
                                setPatientOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  patient.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {patient.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='doctorId'
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Médico</FormLabel>
                <Popover open={doctorOpen} onOpenChange={setDoctorOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? doctors.find((doctor) => doctor.id === field.value)?.name
                          : "Selecione um médico"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Pesquisar médico..." />
                      <CommandList>
                        <CommandEmpty>Nenhum médico encontrado.</CommandEmpty>
                        <CommandGroup>
                          {doctors.map((doctor) => (
                            <CommandItem
                              key={doctor.id}
                              value={doctor.name}
                              onSelect={() => {
                                form.setValue('doctorId', doctor.id)
                                setDoctorOpen(false)
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  doctor.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {doctor.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedDoctor && (
            <div className="rounded-lg border bg-muted/50 p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Especialidade:</span>
                <span className="font-medium">{selectedDoctor.specialty}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valor da consulta:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(selectedDoctor.appointmentPriceInCents / 100)}
                </span>
              </div>
            </div>
          )}

          <FormField
            control={form.control}
            name='date'
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data e hora</FormLabel>
                <FormControl>
                  <DateTimePicker
                    date={field.value}
                    onDateChange={field.onChange}
                    availableSlots={availableTimeSlots}
                    busySlots={bookedSlots}
                    availableWeekDays={
                      selectedDoctor
                        ? {
                            from: selectedDoctor.availableFromWeekDay,
                            to: selectedDoctor.availableToWeekDay,
                          }
                        : undefined
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={upsertAppointmentAction.isPending}
          >
            {upsertAppointmentAction.isPending ? (
              <>
                <Loader2 className="mr-2 animate-spin" />
                {appointment ? 'Editando...' : 'Adicionando...'}
              </>
            ) : (
              appointment ? 'Editar' : 'Adicionar'
            )}
          </Button>
        </form>
      </Form>
    </DialogContent>
  )
}

