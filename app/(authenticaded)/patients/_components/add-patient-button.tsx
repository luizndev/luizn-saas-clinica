"use client"

import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'

import { UpsertPatientDialog } from './upsert-patient-dialog'

export const AddPatientButton = () => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus />Adicionar paciente</Button>
      </DialogTrigger>
      <UpsertPatientDialog isOpen={open} onSuccess={() => setOpen(false)} />
    </Dialog>
  )
}
