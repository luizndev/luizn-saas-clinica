'use client'

import { Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button';

interface TrashDropZoneProps {
  onDropDoctor: (doctor: { id: string; name: string }) => void
}

export default function TrashDropZone({ onDropDoctor }: TrashDropZoneProps) {
  const [isOver, setIsOver] = useState(false)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsOver(false)

    const data = e.dataTransfer.getData('application/json')
    if (!data) return

    const doctor = JSON.parse(data)
    onDropDoctor(doctor)
  }

  return (
    <Button
      onDragOver={(e) => {
        e.preventDefault()
        setIsOver(true)
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
      className={`flex items-center gap-2 px-4 py-2 border-dashed border transition-all duration-300
        ${isOver ? 'bg-red-100 border-destructive scale-105' : 'bg-transparent border-border'}
      `}
    >
      <Trash2 className={`transition-colors ${isOver ? 'text-destructive' : 'text-muted-foreground'}`} />
      <span className={`text-sm ${isOver ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
        Arraste aqui para excluir
      </span>
    </Button>
  )
}
