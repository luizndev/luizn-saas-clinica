"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface DateTimePickerProps {
  date?: Date
  onDateChange: (date: Date | undefined) => void
  availableSlots?: string[]
  busySlots?: string[]
  availableWeekDays?: { from: number; to: number }
}

export function DateTimePicker({ date, onDateChange, availableSlots, busySlots = [], availableWeekDays }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)
  const [selectedTime, setSelectedTime] = React.useState<string>(
    date && date instanceof Date && !isNaN(date.getTime()) ? format(date, "HH:mm") : ""
  )

  const timeSlots = React.useMemo(() => {
    const applyMinus3 = (time: string) => {
      const [hour, minute] = time.split(':').map(Number)
      const date = new Date()
      date.setHours(hour)
      date.setMinutes(minute)
      date.setSeconds(0)

      // Subtrai 3 horas
      date.setHours(date.getHours() - 3)

      const newHour = String(date.getHours()).padStart(2, '0')
      const newMinute = String(date.getMinutes()).padStart(2, '0')

      return `${newHour}:${newMinute}`
    }

    const allSlots = availableSlots && availableSlots.length > 0 
      ? availableSlots 
      : Array.from({ length: 21 }, (_, i) => {
          const h = 8 + Math.floor(i / 2)
          const m = i % 2 === 0 ? '00' : '30'
          return `${String(h).padStart(2, '0')}:${m}`
        })

    return allSlots.map(slot => ({
      time: applyMinus3(slot),
      original: slot,
      isBusy: busySlots.includes(slot)
    }))
  }, [availableSlots, busySlots])


  React.useEffect(() => {
    if (date && date instanceof Date && !isNaN(date.getTime())) {
      setSelectedDate(date)
      setSelectedTime(format(date, "HH:mm"))
    }
  }, [date])

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) {
      setSelectedDate(undefined)
      onDateChange(undefined)
      return
    }

    const timeToUse = selectedTime || timeSlots[0]?.original || "09:00"
    const [hours, minutes] = timeToUse.split(':').map(Number)
    
    const localDate = new Date(newDate)
    localDate.setHours(hours, minutes, 0, 0)
    
    setSelectedDate(localDate)
    setSelectedTime(timeToUse)
    onDateChange(localDate)
  }

  const handleTimeChange = (time: string) => {
    setSelectedTime(time)
    
    if (selectedDate) {
      const [hours, minutes] = time.split(':').map(Number)
      
      const localDate = new Date(selectedDate)
      localDate.setHours(hours, minutes, 0, 0)
      
      setSelectedDate(localDate)
      onDateChange(localDate)
    }
  }

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date < today) return true
    
    if (!availableWeekDays) return false
    
    const dayOfWeek = date.getDay()
    const { from, to } = availableWeekDays
    
    if (from <= to) {
      return dayOfWeek < from || dayOfWeek > to
    } else {
      return dayOfWeek < from && dayOfWeek > to
    }
  }

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "flex-1 justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "dd/MM/yyyy", { locale: ptBR })
            ) : (
              <span>Selecione a data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
            locale={ptBR}
            disabled={isDateDisabled}
          />
        </PopoverContent>
      </Popover>

      <Select value={selectedTime} onValueChange={handleTimeChange}>
        <SelectTrigger className="w-[130px]">
          <Clock className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Horário" />
        </SelectTrigger>
        <SelectContent>
          {timeSlots.map((slot) => (
            <SelectItem 
              key={slot.original} 
              value={slot.original}
              disabled={slot.isBusy}
            >
              {slot.time}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
