'use client'

import { Loader2 } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
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
import { deleteDoctor } from '@/services/delete-doctor'

interface DeleteDoctorDialogProps {
  doctor: { id: string; name: string } | null
  open: boolean
  onClose: () => void
}

export default function DeleteDoctorDialog({
  doctor,
  open,
  onClose,
}: DeleteDoctorDialogProps) {
  const deleteDoctorAction = useAction(deleteDoctor, {
    onSuccess() {
      toast.success('Médico excluído com sucesso')
      onClose()
    },
    onError(error) {
      console.error(error)
      toast.error('Erro ao excluir médico')
    },
  })

  const handleDelete = () => {
    if (!doctor) return
    deleteDoctorAction.execute({ doctorId: doctor.id })
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir médico</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir <strong>{doctor?.name}</strong>? Esta
            ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteDoctorAction.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteDoctorAction.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleteDoctorAction.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              'Excluir'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
