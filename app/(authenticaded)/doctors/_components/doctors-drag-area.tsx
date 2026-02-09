'use client'

import { useState } from 'react'

import { doctorsTable } from '@/db/schema'

import DeleteDoctorDialog from './delete-doctor-dialog'
import DoctorCard from './doctor-card'
import TrashDropZone from './trash-drop-zone'

interface DoctorsDragAreaProps {
  doctors: Array<typeof doctorsTable.$inferSelect>
}

export default function DoctorsDragArea({ doctors }: DoctorsDragAreaProps) {
  const [doctorToDelete, setDoctorToDelete] = useState<{
    id: string
    name: string
  } | null>(null)

  function handleDrop(doctor: { id: string; name: string }) {
    setDoctorToDelete(doctor)
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <TrashDropZone onDropDoctor={handleDrop} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {doctors.map((dr) => (
          <DoctorCard key={dr.id} doctor={dr} />
        ))}
      </div>

      <DeleteDoctorDialog
        doctor={doctorToDelete}
        open={!!doctorToDelete}
        onClose={() => setDoctorToDelete(null)}
      />
    </>
  )
}
