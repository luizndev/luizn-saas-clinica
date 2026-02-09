'use client'

import { useState } from 'react'

import { PageActions, PageContainer, PageContent, PageDescription, PageHeader, PageHeaderContent, PageTitle } from '@/components/ui/page-container'
import { doctorsTable } from '@/db/schema'

import AddDoctorButton from './add-doctor-button'
import DeleteDoctorDialog from './delete-doctor-dialog'
import DoctorCard from './doctor-card'
import TrashDropZone from './trash-drop-zone'

interface DoctorsPageLayoutProps {
  doctors: Array<typeof doctorsTable.$inferSelect>
}

export default function DoctorsPageLayout({ doctors }: DoctorsPageLayoutProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [doctorToDelete, setDoctorToDelete] = useState<{
    id: string
    name: string
  } | null>(null)

  function handleDrop(doctor: { id: string; name: string }) {
    setDoctorToDelete(doctor)
    setIsDragging(false)
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Médicos</PageTitle>
          <PageDescription>Gerencie os médicos da sua clínica</PageDescription>
        </PageHeaderContent>
        <PageActions>
          {isDragging && <TrashDropZone onDropDoctor={handleDrop} />}
          <AddDoctorButton />
        </PageActions>
      </PageHeader>

      <PageContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {doctors.map((dr) => (
            <DoctorCard 
              key={dr.id} 
              doctor={dr} 
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => setIsDragging(false)}
            />
          ))}
        </div>
      </PageContent>

      <DeleteDoctorDialog
        doctor={doctorToDelete}
        open={!!doctorToDelete}
        onClose={() => setDoctorToDelete(null)}
      />
    </PageContainer>
  )
}
