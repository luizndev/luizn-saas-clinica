"use client"
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
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
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { doctorsTable } from '@/db/schema'
import { cn } from '@/lib/utils'
import { upsertDoctor } from '@/services/upsert-doctor'
import { formatTime2 } from '@/utils/format'

import { medicalSpecialties } from '../_constants'

type Doctor = typeof doctorsTable.$inferSelect

const weekDays = [
  { value: "0", label: 'Domingo' },
  { value: "1", label: 'Segunda-feira' },
  { value: "2", label: 'Terça-feira' },
  { value: "3", label: 'Quarta-feira' },
  { value: "4", label: 'Quinta-feira' },
  { value: "5", label: 'Sexta-feira' },
  { value: "6", label: 'Sábado' },
]

const formSchema = z.object({
  name: z.string().trim().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
  specialty: z.string().trim().min(3).max(100),
  avatarImageUrl: z.string().url('URL inválida').optional().or(z.literal("")),
  availableFromWeekDay: z.string(),
  availableToWeekDay: z.string(),
  availableFromTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Formato de hora inválido'),
  availableToTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Formato de hora inválido'),
  appointmentPriceInCents: z.number().min(0, 'Preço deve ser maior que 0'),
}).refine((data) => {
  return data.availableToTime > data.availableFromTime
}, {
  message: 'O horário final deve ser após o horário inicial',
  path: ['availableToTime'],
})

interface UpsertDoctorFormProps {
  doctor?: Doctor
  onSuccess?: () => void
  onError?: (error: unknown) => void
  isOpen?: boolean
}

const UpsertDoctor = ({ doctor, onSuccess, onError, isOpen }: UpsertDoctorFormProps) => {
  const [specialtyOpen, setSpecialtyOpen] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: doctor?.name ?? '',
      specialty: doctor?.specialty ?? '',
      avatarImageUrl: doctor?.avatarImageUrl ?? '',
      availableFromWeekDay: doctor?.availableFromWeekDay.toString() ?? "1",
      availableToWeekDay: doctor?.availableToWeekDay.toString() ?? "5",
      availableFromTime: formatTime2(doctor?.availableFromTime) ?? '',
      availableToTime: formatTime2(doctor?.availableToTime) ?? '',
      appointmentPriceInCents: (doctor?.appointmentPriceInCents ?? 0) / 100,
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: doctor?.name ?? '',
        specialty: doctor?.specialty ?? '',
        avatarImageUrl: doctor?.avatarImageUrl ?? '',
        availableFromWeekDay: doctor?.availableFromWeekDay.toString() ?? "1",
        availableToWeekDay: doctor?.availableToWeekDay.toString() ?? "5",
        availableFromTime: formatTime2(doctor?.availableFromTime) ?? '',
        availableToTime: formatTime2(doctor?.availableToTime) ?? '',
        appointmentPriceInCents: (doctor?.appointmentPriceInCents ?? 0) / 100,
      })
    }
  }, [isOpen, doctor, form])

  const upsertDoctorAction = useAction(upsertDoctor, {
    onSuccess() {
      form.reset()
      onSuccess?.()
      toast.success('Médico adicionado com sucesso')
    },
    onError(error) {
      console.log(error)
      onError?.(error)
      toast.error('Erro ao adicionar médico')
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    upsertDoctorAction.execute({
      ...data,
      id: doctor?.id,
      availableFromWeekDay: parseInt(data.availableFromWeekDay),
      availableToWeekDay: parseInt(data.availableToWeekDay),
      appointmentPriceInCents: data.appointmentPriceInCents,
    })
  }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{doctor ? 'Editar' : 'Adicionar'} médico</DialogTitle>
                <DialogDescription>
                    {doctor ? 'Edite' : 'Adicione'} um novo médico à sua clínica
                </DialogDescription>
            </DialogHeader>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>

                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input placeholder='Nome' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="specialty"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Especialidade</FormLabel>
                                <Popover open={specialtyOpen} onOpenChange={setSpecialtyOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? medicalSpecialties.find(
                                                        (specialty) => specialty.value === field.value
                                                    )?.label
                                                    : "Selecione uma especialidade"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Pesquisar especialidade..." />
                                            <CommandList>
                                                <CommandEmpty>Nenhuma especialidade encontrada.</CommandEmpty>
                                                <CommandGroup>
                                                    {medicalSpecialties.map((specialty) => (
                                                        <CommandItem
                                                            key={specialty.value}
                                                            value={specialty.label}
                                                            onSelect={() => {
                                                                form.setValue('specialty', specialty.value)
                                                                setSpecialtyOpen(false)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    specialty.value === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {specialty.label}
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
                        name='appointmentPriceInCents'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Preço da consulta</FormLabel>
                                <FormControl>
                                    <NumericFormat
                                        customInput={Input}
                                        thousandSeparator="."
                                        decimalSeparator=","
                                        prefix="R$ "
                                        allowNegative={false}
                                        onValueChange={(values) => {
                                            const cents = Math.round((values.floatValue || 0) * 100)
                                            field.onChange(cents)
                                        }}
                                        value={(field.value || 0) / 100}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-4">
                        <FormField
                            control={form.control}
                            name="availableFromWeekDay"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Dia inicial</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {weekDays.map((weekDay) => (
                                                <SelectItem
                                                    key={weekDay.value}
                                                    value={weekDay.value}
                                                >
                                                    {weekDay.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="availableToWeekDay"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Dia final</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {weekDays.map((weekDay) => (
                                                <SelectItem
                                                    key={weekDay.value}
                                                    value={weekDay.value}
                                                >
                                                    {weekDay.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex gap-4">
                        <FormField
                            control={form.control}
                            name="availableFromTime"
                            render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Horário inicial de disponibilidade</FormLabel>
                                <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione um horário" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup>
                                    <SelectLabel>Manhã</SelectLabel>
                                    <SelectItem value="05:00:00">05:00</SelectItem>
                                    <SelectItem value="05:30:00">05:30</SelectItem>
                                    <SelectItem value="06:00:00">06:00</SelectItem>
                                    <SelectItem value="06:30:00">06:30</SelectItem>
                                    <SelectItem value="07:00:00">07:00</SelectItem>
                                    <SelectItem value="07:30:00">07:30</SelectItem>
                                    <SelectItem value="08:00:00">08:00</SelectItem>
                                    <SelectItem value="08:30:00">08:30</SelectItem>
                                    <SelectItem value="09:00:00">09:00</SelectItem>
                                    <SelectItem value="09:30:00">09:30</SelectItem>
                                    <SelectItem value="10:00:00">10:00</SelectItem>
                                    <SelectItem value="10:30:00">10:30</SelectItem>
                                    <SelectItem value="11:00:00">11:00</SelectItem>
                                    <SelectItem value="11:30:00">11:30</SelectItem>
                                    <SelectItem value="12:00:00">12:00</SelectItem>
                                    <SelectItem value="12:30:00">12:30</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                    <SelectLabel>Tarde</SelectLabel>
                                    <SelectItem value="13:00:00">13:00</SelectItem>
                                    <SelectItem value="13:30:00">13:30</SelectItem>
                                    <SelectItem value="14:00:00">14:00</SelectItem>
                                    <SelectItem value="14:30:00">14:30</SelectItem>
                                    <SelectItem value="15:00:00">15:00</SelectItem>
                                    <SelectItem value="15:30:00">15:30</SelectItem>
                                    <SelectItem value="16:00:00">16:00</SelectItem>
                                    <SelectItem value="16:30:00">16:30</SelectItem>
                                    <SelectItem value="17:00:00">17:00</SelectItem>
                                    <SelectItem value="17:30:00">17:30</SelectItem>
                                    <SelectItem value="18:00:00">18:00</SelectItem>
                                    <SelectItem value="18:30:00">18:30</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                    <SelectLabel>Noite</SelectLabel>
                                    <SelectItem value="19:00:00">19:00</SelectItem>
                                    <SelectItem value="19:30:00">19:30</SelectItem>
                                    <SelectItem value="20:00:00">20:00</SelectItem>
                                    <SelectItem value="20:30:00">20:30</SelectItem>
                                    <SelectItem value="21:00:00">21:00</SelectItem>
                                    <SelectItem value="21:30:00">21:30</SelectItem>
                                    <SelectItem value="22:00:00">22:00</SelectItem>
                                    <SelectItem value="22:30:00">22:30</SelectItem>
                                    <SelectItem value="23:00:00">23:00</SelectItem>
                                    <SelectItem value="23:30:00">23:30</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="availableToTime"
                            render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Horário final de disponibilidade</FormLabel>
                                <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                >
                                <FormControl>
                                    <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione um horário" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup>
                                    <SelectLabel>Manhã</SelectLabel>
                                    <SelectItem value="05:00:00">05:00</SelectItem>
                                    <SelectItem value="05:30:00">05:30</SelectItem>
                                    <SelectItem value="06:00:00">06:00</SelectItem>
                                    <SelectItem value="06:30:00">06:30</SelectItem>
                                    <SelectItem value="07:00:00">07:00</SelectItem>
                                    <SelectItem value="07:30:00">07:30</SelectItem>
                                    <SelectItem value="08:00:00">08:00</SelectItem>
                                    <SelectItem value="08:30:00">08:30</SelectItem>
                                    <SelectItem value="09:00:00">09:00</SelectItem>
                                    <SelectItem value="09:30:00">09:30</SelectItem>
                                    <SelectItem value="10:00:00">10:00</SelectItem>
                                    <SelectItem value="10:30:00">10:30</SelectItem>
                                    <SelectItem value="11:00:00">11:00</SelectItem>
                                    <SelectItem value="11:30:00">11:30</SelectItem>
                                    <SelectItem value="12:00:00">12:00</SelectItem>
                                    <SelectItem value="12:30:00">12:30</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                    <SelectLabel>Tarde</SelectLabel>
                                    <SelectItem value="13:00:00">13:00</SelectItem>
                                    <SelectItem value="13:30:00">13:30</SelectItem>
                                    <SelectItem value="14:00:00">14:00</SelectItem>
                                    <SelectItem value="14:30:00">14:30</SelectItem>
                                    <SelectItem value="15:00:00">15:00</SelectItem>
                                    <SelectItem value="15:30:00">15:30</SelectItem>
                                    <SelectItem value="16:00:00">16:00</SelectItem>
                                    <SelectItem value="16:30:00">16:30</SelectItem>
                                    <SelectItem value="17:00:00">17:00</SelectItem>
                                    <SelectItem value="17:30:00">17:30</SelectItem>
                                    <SelectItem value="18:00:00">18:00</SelectItem>
                                    <SelectItem value="18:30:00">18:30</SelectItem>
                                    </SelectGroup>
                                    <SelectGroup>
                                    <SelectLabel>Noite</SelectLabel>
                                    <SelectItem value="19:00:00">19:00</SelectItem>
                                    <SelectItem value="19:30:00">19:30</SelectItem>
                                    <SelectItem value="20:00:00">20:00</SelectItem>
                                    <SelectItem value="20:30:00">20:30</SelectItem>
                                    <SelectItem value="21:00:00">21:00</SelectItem>
                                    <SelectItem value="21:30:00">21:30</SelectItem>
                                    <SelectItem value="22:00:00">22:00</SelectItem>
                                    <SelectItem value="22:30:00">22:30</SelectItem>
                                    <SelectItem value="23:00:00">23:00</SelectItem>
                                    <SelectItem value="23:30:00">23:30</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <Button
                    type="submit"
                    className="w-full"
                    disabled={upsertDoctorAction.isPending}
                    >
                    {upsertDoctorAction.isPending ? (
                        <>
                        <Loader2 className="mr-2 animate-spin" />
                        {doctor ? 'Editando...' : 'Adicionando...'}
                        </>
                    ) : (
                        doctor ? 'Editar' : 'Adicionar'
                    )}
                    </Button>
                </form>
            </Form>
        </DialogContent>
    )
}

export default UpsertDoctor
