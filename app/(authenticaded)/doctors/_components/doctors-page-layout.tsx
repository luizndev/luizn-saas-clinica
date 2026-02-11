"use client"

import { DollarSign, Stethoscope, User } from 'lucide-react'
import { useState } from 'react'

import { PageActions, PageContainer, PageContent, PageDescription, PageHeader, PageHeaderContent, PageTitle } from '@/components/ui/page-container'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
        {(!doctors || doctors.length === 0) ? (
          <div className="rounded-md border">
            <Table className='border-0'>
              <TableHeader className='bg-primary/5'>
                <TableRow>
                  <TableHead className='text-[#5B7189] font-semibold'>
                    <div className='flex items-center gap-2'>
                      <User className='h-4 w-4' />
                      Nome
                    </div>
                  </TableHead>
                  <TableHead className='text-[#5B7189] font-semibold'>Especialidade</TableHead>
                  <TableHead className='text-[#5B7189] font-semibold text-right'>
                    <div className='flex items-center gap-2 justify-end'>
                      <DollarSign className='h-4 w-4' />
                      Valor
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground h-32">
                    <div className='flex flex-col items-center gap-2'>
                      <Stethoscope className='h-8 w-8 text-muted-foreground/50' />
                      <p>Nenhum médico cadastrado</p>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
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
    </PageContainer>
  )
}
