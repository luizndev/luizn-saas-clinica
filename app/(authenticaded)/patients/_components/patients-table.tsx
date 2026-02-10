"use client"

import { Download, Edit, Mail, Mars, Phone, User, Users, Users2, Venus } from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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

import { UpsertPatientDialog } from './upsert-patient-dialog'

interface Patient {
  id: string
  name: string
  email: string
  phoneNumber: string
  sex: 'male' | 'female' | 'other'
}

interface PatientsTableProps {
  patients: Patient[]
}

const getSexData = (sex: string) => {
  const sexData = {
    male: { label: 'Masculino', variant: 'male' as const, icon: Mars },
    female: { label: 'Feminino', variant: 'female' as const, icon: Venus },
    other: { label: 'Outros', variant: 'outline' as const, icon: Users2 },
  }
  return sexData[sex as keyof typeof sexData] || { label: sex, variant: 'outline' as const, icon: Users2 }
}

const exportToCSV = (patients: Patient[]) => {
  // Cabeçalhos do CSV
  const headers = ['Nome', 'E-mail', 'Telefone', 'Sexo']
  
  // Converter pacientes para linhas CSV
  const rows = patients.map(patient => [
    patient.name,
    patient.email,
    patient.phoneNumber,
    getSexData(patient.sex).label
  ])
  
  // Combinar cabeçalhos e linhas
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  // Criar blob e fazer download
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `pacientes_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const PatientsTable = ({ patients }: PatientsTableProps) => {
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient)
    setDialogOpen(true)
  }

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setEditingPatient(null)
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportToCSV(patients)}
            disabled={patients.length === 0}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
        
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
              <TableHead className='text-[#5B7189] font-semibold'>
                <div className='flex items-center gap-2'>
                  <Mail className='h-4 w-4' />
                  E-mail
                </div>
              </TableHead>
              <TableHead className='text-[#5B7189] font-semibold'>
                <div className='flex items-center gap-2'>
                  <Phone className='h-4 w-4' />
                  Telefone
                </div>
              </TableHead>
              <TableHead className='text-[#5B7189] font-semibold'>
                <div className='flex items-center gap-2'>
                  <Users className='h-4 w-4' />
                  Sexo
                </div>
              </TableHead>
              <TableHead className="w-[100px] text-[#5B7189] font-semibold"> </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground h-32">
                  <div className='flex flex-col items-center gap-2'>
                    <Users className='h-8 w-8 text-muted-foreground/50' />
                    <p>Nenhum paciente cadastrado</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              patients.map((patient) => {
                const sexData = getSexData(patient.sex)
                return (
                  <TableRow key={patient.id} className='hover:bg-muted/50 transition-colors'>
                    <TableCell className="font-medium">
                      <div className='flex items-center gap-3'>
                        <Avatar className='h-8 w-8'>
                          <AvatarFallback className='text-xs'>
                            {patient.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{patient.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className='text-muted-foreground'>
                      {patient.email}
                    </TableCell>
                    <TableCell className='text-muted-foreground'>
                      {patient.phoneNumber}
                    </TableCell>
                    <TableCell>
                      <Badge variant={sexData.variant} className='flex items-center gap-1 w-fit'>
                        <sexData.icon className='h-3 w-3' />
                        {sexData.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(patient)}
                        className='hover:bg-primary/10'
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        {editingPatient && (
          <UpsertPatientDialog
            patient={editingPatient}
            isOpen={dialogOpen}
            onSuccess={() => setDialogOpen(false)}
          />
        )}
      </Dialog>
    </>
  )
}
