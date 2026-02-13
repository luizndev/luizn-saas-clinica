"use client"

import { Stethoscope } from 'lucide-react'
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
          <AddDoctorButton />
        </PageActions>
      </PageHeader>

      <PageContent>
        {(!doctors || doctors.length === 0) ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] rounded-xl border-2 border-dashed bg-muted/30 p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="relative mb-4">
              <div className="absolute -inset-1 rounded-full bg-primary/20 blur-xl" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 transition-transform hover:scale-110">
                <Stethoscope className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h3 className="mb-2 text-2xl font-bold tracking-tight">Nenhum médico encontrado</h3>
            <p className="mb-8 max-w-sm text-sm text-muted-foreground">
              Sua lista de médicos está vazia. Adicione profissionais para começar a gerenciar os agendamentos da sua clínica.
            </p>
            <AddDoctorButton />
          </div>
        ) : (
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
        )}
      </PageContent>

      <DeleteDoctorDialog
        doctor={doctorToDelete}
        open={!!doctorToDelete}
        onClose={() => setDoctorToDelete(null)}
      />

      {isDragging && <TrashDropZone onDropDoctor={handleDrop} />}
    </PageContainer>
  )
}
