'use client'

import { Trash2 } from 'lucide-react'
import { useState } from 'react'


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
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out
        ${isOver ? 'scale-110' : 'scale-100'}
      `}
    >
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsOver(true)
        }}
        onDragLeave={() => setIsOver(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-2 px-10 py-6 rounded-2xl border-2 border-dashed transition-all duration-300 shadow-2xl backdrop-blur-md
          ${isOver 
            ? 'bg-destructive/20 border-destructive text-destructive' 
            : 'bg-background/80 border-muted-foreground/30 text-muted-foreground'}
        `}
      >
        <div className={`p-4 rounded-full transition-colors ${isOver ? 'bg-destructive text-white' : 'bg-muted/50'}`}>
          <Trash2 className="h-8 w-8" />
        </div>
        <div className="text-center">
          <p className={`text-lg font-bold ${isOver ? 'text-destructive' : 'text-foreground'}`}>
            Solte para excluir
          </p>
          <p className="text-sm opacity-80">
            {isOver ? 'Ação irreversível' : 'Arraste o médico aqui'}
          </p>
        </div>
      </div>
    </div>
  )
}
