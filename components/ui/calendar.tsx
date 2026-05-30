"use client"

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type CalendarProps = {
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  className?: string
}

const weekdays = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"]
const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

function sameDay(a?: Date, b?: Date) {
  return (
    !!a &&
    !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function Calendar({ selected, onSelect, className }: CalendarProps) {
  const [month, setMonth] = React.useState(
    () => new Date(selected ?? new Date())
  )
  const years = React.useMemo(() => {
    const centerYear = selected?.getFullYear() ?? new Date().getFullYear()

    return Array.from({ length: 81 }, (_, index) => centerYear - 40 + index)
  }, [selected])

  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1)
  const offset = (monthStart.getDay() + 6) % 7
  const firstCell = new Date(monthStart)
  firstCell.setDate(monthStart.getDate() - offset)

  const days = Array.from({ length: 42 }, (_, index) => {
    const day = new Date(firstCell)
    day.setDate(firstCell.getDate() + index)
    return day
  })

  return (
    <div className={cn("w-fit rounded-lg border bg-card p-3", className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() =>
            setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
          }
        >
          <ChevronLeftIcon />
          <span className="sr-only">Mes anterior</span>
        </Button>
        <div className="flex min-w-44 items-center gap-2">
          <Select
            value={String(month.getMonth())}
            onValueChange={(value) =>
              setMonth(new Date(month.getFullYear(), Number(value), 1))
            }
          >
            <SelectTrigger size="sm" className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((monthName, index) => (
                <SelectItem key={monthName} value={String(index)}>
                  {monthName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(month.getFullYear())}
            onValueChange={(value) =>
              setMonth(new Date(Number(value), month.getMonth(), 1))
            }
          >
            <SelectTrigger size="sm" className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() =>
            setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
          }
        >
          <ChevronRightIcon />
          <span className="sr-only">Mes siguiente</span>
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {weekdays.map((day) => (
          <div key={day} className="flex size-8 items-center justify-center">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const outside = day.getMonth() !== month.getMonth()
          const active = sameDay(day, selected)

          return (
            <Button
              key={day.toISOString()}
              type="button"
              variant={active ? "default" : "ghost"}
              size="icon-sm"
              className={cn(
                "size-8",
                outside && "text-muted-foreground opacity-45"
              )}
              onClick={() => onSelect?.(day)}
            >
              {day.getDate()}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export { Calendar }
