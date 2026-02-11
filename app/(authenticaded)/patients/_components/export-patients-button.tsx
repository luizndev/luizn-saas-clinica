"use client"

import { Download } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { exportToCSV } from './patients-table'

interface Patient {
  id: string
  name: string
  email: string
  phoneNumber: string
  sex: 'male' | 'female' | 'other'
}

interface ExportPatientsButtonProps {
  patients: Patient[]
}

export const ExportPatientsButton = ({ patients }: ExportPatientsButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => exportToCSV(patients)}
      disabled={patients.length === 0}
      className="gap-2 h-10 rounded-md"
    >
      <Download className="h-4 w-4" />
      Exportar CSV
    </Button>
  )
}
