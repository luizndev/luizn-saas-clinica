import dayjs from "dayjs"

export const formatTime = (time: string) => {
    if (!time) return ""
    const [hours, minutes, seconds] = time.split(":").map(Number)
    return dayjs().set('hour', hours).set('minute', minutes).set('second', seconds).format("HH:mm")
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
