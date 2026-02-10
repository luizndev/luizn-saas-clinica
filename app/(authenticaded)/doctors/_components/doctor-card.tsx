"use client"
import { CalendarIcon, ClockIcon, DollarSignIcon, Stethoscope, TrashIcon } from 'lucide-react'
import React, { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { doctorsTable } from '@/db/schema'
import { formatCurrency, formatTime, formatWeekDay } from '@/utils/format'

import UpsertDoctor from './upsert-doctor'

interface DoctorCardProps {
    doctor: typeof doctorsTable.$inferSelect
    onDragStart?: () => void
    onDragEnd?: () => void
}

const DoctorCard = ({ doctor, onDragStart: onDragStartProp, onDragEnd: onDragEndProp }: DoctorCardProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const [isDragging, setIsDragging] = useState(false)

    function handleDragStart(e: React.DragEvent) {
        setIsDragging(true)
        onDragStartProp?.()
        e.dataTransfer.setData(
            'application/json',
            JSON.stringify({
                id: doctor.id,
                name: doctor.name,
            })
        )
    }

    function handleDragEnd() {
        setIsDragging(false)
        onDragEndProp?.()
    }

  return (
    <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className={`transition-opacity ${
            isDragging ? 'opacity-50 cursor-grabbing' : 'opacity-100 cursor-grab'
        }`}
    >
    <Card className='w-full'>
        <CardHeader>
            <div className='flex items-center gap-2'>
                <Avatar className='w-18 h-18'>
                    <AvatarFallback className='text-xl'>{doctor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle>{doctor.name}</CardTitle>
                    <CardDescription className='mt-2'><Badge variant="outline"><Stethoscope className='mr-1'/>{doctor.specialty}</Badge></CardDescription>
                </div>
            </div>
        </CardHeader>
        <div className='px-7'>
            <Separator  />
        </div>
        <CardContent className='flex flex-col gap-2'>
            <Badge variant="outline">
                <CalendarIcon className='mr-1'/>
                {formatWeekDay(doctor.availableFromWeekDay)} a {formatWeekDay(doctor.availableToWeekDay)}
            </Badge>
            <Badge variant="outline">
                <ClockIcon className='mr-1'/>
                {formatTime(doctor.availableFromTime)} - {formatTime(doctor.availableToTime)}
            </Badge>
            <Badge variant="outline">
                <DollarSignIcon className='mr-1'/>
                {formatCurrency(doctor.appointmentPriceInCents / 100)}
            </Badge>
        </CardContent>
        <div className='px-7'>
            <Separator  />
        </div>
        <CardFooter>
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogTrigger asChild>
                    <Button className='w-full'>
                        Ver Detalhes
                    </Button>
                </DialogTrigger>
                <UpsertDoctor doctor={doctor} isOpen={isEditing} onSuccess={() => setIsEditing(false)} />
            </Dialog>
        </CardFooter>

    </Card>
    </div>
  )
}

export default DoctorCard