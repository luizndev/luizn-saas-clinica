"use client"

import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'

import { UpsertAppointmentDialog } from './upsert-appointment-dialog'

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

interface AddAppointmentButtonProps {
  doctors: Doctor[]
  patients: Patient[]
}

export const AddAppointmentButton = ({ doctors, patients }: AddAppointmentButtonProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setDialogOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Adicionar agendamento
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <UpsertAppointmentDialog
          doctors={doctors}
          patients={patients}
          isOpen={dialogOpen}
          onSuccess={() => setDialogOpen(false)}
        />
      </Dialog>
    </>
  )
}
