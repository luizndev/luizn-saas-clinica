"use client"

import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { Calendar, DollarSign, Edit, Stethoscope, Trash2, User } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import { useState } from 'react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteAppointment } from '@/services/delete-appointment'

import { UpsertAppointmentDialog } from './upsert-appointment-dialog'

interface Appointment {
  id: string
  date: Date
  status: 'pending' | 'confirmed' | 'completed'
  patientId: string
  patientName: string
  doctorId: string
  doctorName: string
  specialty: string
  appointmentPriceInCents: number
}

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

interface AppointmentsTableProps {
  appointments: Appointment[]
  doctors: Doctor[]
  patients: Patient[]
}



dayjs.extend(utc)
dayjs.extend(timezone)

export const AppointmentsTable = ({ appointments, doctors, patients }: AppointmentsTableProps) => {
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null)

  const { execute: executeDelete, isExecuting: isDeleting } = useAction(deleteAppointment, {
    onSuccess: () => {
      toast.success('Agendamento excluído com sucesso!')
      setDeleteDialogOpen(false)
      setAppointmentToDelete(null)
    },
    onError: () => {
      toast.error('Erro ao excluir agendamento')
    },
  })

  const handleDeleteClick = (appointmentId: string) => {
    setAppointmentToDelete(appointmentId)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (appointmentToDelete) {
      executeDelete({ id: appointmentToDelete })
    }
  }

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment)
    setDialogOpen(true)
  }

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setEditingAppointment(null)
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <Table className='border-0'>
          <TableHeader className='bg-primary/5'>
            <TableRow>
              <TableHead className='text-[#5B7189] font-semibold'>
                <div className='flex items-center gap-2'>
                  <User className='h-4 w-4' />
                  Paciente
                </div>
              </TableHead>
              <TableHead className='text-[#5B7189] font-semibold'>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4' />
                  Data
                </div>
              </TableHead>
              <TableHead className='text-[#5B7189] font-semibold'>
                <div className='flex items-center gap-2'>
                  <Stethoscope className='h-4 w-4' />
                  Médico
                </div>
              </TableHead>
              <TableHead className='text-[#5B7189] font-semibold'>Especialidade</TableHead>
              <TableHead className='text-[#5B7189] font-semibold'>
                <div className='flex items-center gap-2'>
                  <DollarSign className='h-4 w-4' />
                  Valor
                </div>
              </TableHead>
              <TableHead className='text-[#5B7189] font-semibold'>Status</TableHead>
              <TableHead className="w-[100px] text-[#5B7189] font-semibold"> </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground h-32">
                  <div className='flex flex-col items-center gap-2'>
                    <Calendar className='h-8 w-8 text-muted-foreground/50' />
                    <p>Nenhum agendamento cadastrado</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appointment) => {
                return (
                  <TableRow key={appointment.id} className='hover:bg-muted/50 transition-colors'>
                    <TableCell className="font-medium">
                      {appointment.patientName}
                    </TableCell>
                    <TableCell className='text-muted-foreground'>
                      {dayjs.utc(appointment.date).local().format('DD/MM/YYYY, HH:mm')}
                    </TableCell>
                    <TableCell className='font-medium'>
                      {appointment.doctorName}
                    </TableCell>
                    <TableCell className='text-muted-foreground'>
                      {appointment.specialty}
                    </TableCell>
                    <TableCell className='font-medium'>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(appointment.appointmentPriceInCents / 100)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`flex w-fit items-center gap-2 border-none px-2.5 py-0.5 text-xs font-semibold shadow-none ${
                            appointment.status === "confirmed"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : appointment.status === "completed"
                              ? "bg-blue-500/10 text-blue-500"
                              : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <div className={`h-1.5 w-1.5 rounded-full ${
                            appointment.status === "confirmed"
                            ? "bg-emerald-500"
                            : appointment.status === "completed"
                              ? "bg-blue-500"
                              : "bg-gray-500"
                        }`} />
                        {appointment.status === "confirmed"
                          ? "Confirmado"
                          : appointment.status === "completed"
                            ? "Concluído"
                            : "Pendente"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(appointment)}
                          className='hover:bg-primary/10'
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(appointment.id)}
                          className='text-muted-foreground hover:bg-destructive/10'
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        {editingAppointment && (
          <UpsertAppointmentDialog
            appointment={editingAppointment}
            doctors={doctors}
            patients={patients}
            appointments={appointments}
            isOpen={dialogOpen}
            onSuccess={() => setDialogOpen(false)}
          />
        )}
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Agendamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {isDeleting ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
