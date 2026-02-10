"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { PatternFormat } from 'react-number-format'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { upsertPatient } from '@/services/upsert-patient'

const formSchema = z.object({
  name: z.string().trim().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
  email: z.string().email('E-mail inválido').trim(),
  phoneNumber: z.string().min(1, 'Telefone é obrigatório'),
  sex: z.enum(['male', 'female', 'other']),
})

interface Patient {
  id: string
  name: string
  email: string
  phoneNumber: string
  sex: 'male' | 'female' | 'other'
}

interface UpsertPatientDialogProps {
  patient?: Patient
  onSuccess?: () => void
  onError?: (error: unknown) => void
  isOpen: boolean
}

export const UpsertPatientDialog = ({ patient, onSuccess, onError, isOpen }: UpsertPatientDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUnregister: true,
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: patient?.name ?? '',
      email: patient?.email ?? '',
      phoneNumber: patient?.phoneNumber ?? '',
      sex: patient?.sex ?? 'male',
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: patient?.name ?? '',
        email: patient?.email ?? '',
        phoneNumber: patient?.phoneNumber ?? '',
        sex: patient?.sex ?? 'male',
      })
    }
  }, [isOpen, patient, form])

  const upsertPatientAction = useAction(upsertPatient, {
    onSuccess() {
      form.reset()
      onSuccess?.()
      toast.success(patient ? 'Paciente atualizado com sucesso' : 'Paciente adicionado com sucesso')
    },
    onError(error) {
      console.log(error)
      onError?.(error)
      toast.error('Erro ao salvar paciente')
    },
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    upsertPatientAction.execute({
      ...data,
      id: patient?.id,
    })
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{patient ? 'Editar' : 'Adicionar'} paciente</DialogTitle>
        <DialogDescription>
          {patient ? 'Edite' : 'Adicione'} um paciente à sua clínica
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
                  <Input placeholder='Nome completo' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type='email' placeholder='email@agendafacil.com' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='phoneNumber'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <PatternFormat
                    customInput={Input}
                    format="(##) #####-####"
                    mask="_"
                    placeholder='(99) 99999-9999'
                    onValueChange={(values) => {
                      field.onChange(values.formattedValue)
                    }}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='sex'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="female">Feminino</SelectItem>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="other">Outros</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={upsertPatientAction.isPending}
          >
            {upsertPatientAction.isPending ? (
              <>
                <Loader2 className="mr-2 animate-spin" />
                {patient ? 'Editando...' : 'Adicionando...'}
              </>
            ) : (
              patient ? 'Editar' : 'Adicionar'
            )}
          </Button>
        </form>
      </Form>
    </DialogContent>
  )
}
