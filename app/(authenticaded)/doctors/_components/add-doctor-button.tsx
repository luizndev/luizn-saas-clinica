"use client"
import { PlusIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'

import UpsertDoctor from './upsert-doctor'

const AddDoctorButton = () => {
    const [open, setOpen] = useState(false)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button><PlusIcon />Adicionar médico</Button>
            </DialogTrigger>
            <UpsertDoctor onSuccess={() => setOpen(false)} />
        </Dialog>
    )
}

export default AddDoctorButton