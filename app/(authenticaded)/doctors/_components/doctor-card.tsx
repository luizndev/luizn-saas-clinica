import { CalendarIcon, ClockIcon, DollarSignIcon, Stethoscope } from 'lucide-react'
import React from 'react'

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
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  return (
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
        <Separator />
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
                {formatCurrency(doctor.appointmentPriceInCents / 10000)}
            </Badge>
        </CardContent>
        <Separator />
        <CardFooter>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className='w-full'>
                        Ver Detalhes
                    </Button>
                </DialogTrigger>
                <UpsertDoctor />
            </Dialog>
        </CardFooter>

    </Card>
  )
}

export default DoctorCard