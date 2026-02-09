import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)
dayjs.extend(timezone)

export const formatTime = (time: string) => {
    if (!time) return ""

    const [hours, minutes, seconds] = time.split(":").map(Number)

    const utcTime = dayjs
        .utc()
        .set("hour", hours)
        .set("minute", minutes)
        .set("second", seconds)

    return utcTime.local().format("HH:mm")
}
export const formatTime2 = (time: string) => {
    if (!time) return ""

    const [hours, minutes, seconds] = time.split(":").map(Number)

    const utcTime = dayjs
        .utc()
        .set("hour", hours)
        .set("minute", minutes)
        .set("second", seconds)

    return utcTime.local().format("HH:mm:ss")
}

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(amount)
}

export const formatWeekDay = (day: number) => {
  const days = [
    "Domingo",
    "Segunda-Feira",
    "Terça-Feira",
    "Quarta-Feira",
    "Quinta-Feira",
    "Sexta-Feira",
    "Sábado"
  ]

  return days[day] ?? ""
}
