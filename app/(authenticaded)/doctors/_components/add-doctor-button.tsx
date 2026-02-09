"use client"
import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'

import UpsertDoctor from './upsert-doctor'

const AddDoctorButton = () => {
  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button><PlusIcon />Adicionar médico</Button>
        </DialogTrigger>
        <UpsertDoctor />
    </Dialog>
  )
}

export default AddDoctorButton