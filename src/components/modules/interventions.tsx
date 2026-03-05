"use client"

import { useState } from "react"
import { Plus, Wrench, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { interventions, properties, workers } from "@/lib/mock-data"

const statusDotColors: Record<string, string> = {
  planned: "bg-blue-500",
  "in-progress": "bg-orange-500",
  completed: "bg-green-500",
}

const statusBorderColors: Record<string, string> = {
  planned: "border-l-blue-500",
  "in-progress": "border-l-orange-500",
  completed: "border-l-green-500",
}

const statusLabels: Record<string, string> = {
  planned: "Gepland",
  "in-progress": "In Uitvoering",
  completed: "Voltooid",
}

const dayNames = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"]
const monthNames = [
  "Januari", "Februari", "Maart", "April", "Mei", "Juni",
  "Juli", "Augustus", "September", "Oktober", "November", "December",
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

export function InterventionsModule() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1))
  const [showNew, setShowNew] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const totalCost = interventions.reduce((s, i) => s + i.cost, 0)
  const planned = interventions.filter((i) => i.status === "planned").length
  const inProgress = interventions.filter((i) => i.status === "in-progress").length

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const goToToday = () => setCurrentDate(new Date(2026, 2, 1))

  const getInterventionsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return interventions.filter((i) => i.scheduledDate === dateStr)
  }

  const calendarDays: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) calendarDays.push(null)
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d)
  while (calendarDays.length % 7 !== 0) calendarDays.push(null)

  const isToday = (day: number | null): boolean => day === 5 && month === 2 && year === 2026

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Interventies</h2>
          <p className="text-muted-foreground">Gepland onderhoud en werkorders</p>
        </div>
        <Button onClick={() => setShowNew(!showNew)}>
          <Plus className="size-4 mr-2" /> Interventie Plannen
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-blue-500/10">
              <Calendar className="size-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{planned}</p>
              <p className="text-xs text-muted-foreground">Gepland</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-orange-500/10">
              <Clock className="size-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{inProgress}</p>
              <p className="text-xs text-muted-foreground">In Uitvoering</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <Wrench className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">&euro;{totalCost.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Totaal Budget</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Intervention Form */}
      {showNew && (
        <Card>
          <CardHeader>
            <CardTitle>Nieuwe Interventie Plannen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Pand</label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Selecteer pand" /></SelectTrigger>
                  <SelectContent>
                    {properties.map((p) => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Vakman Toewijzen</label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Selecteer vakman" /></SelectTrigger>
                  <SelectContent>
                    {workers.map((w) => (<SelectItem key={w.id} value={w.id}>{w.name} ({w.specialty})</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Titel</label>
                <Input placeholder="Titel interventie" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Geplande Datum</label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Geschatte Kosten</label>
                <Input type="number" placeholder="0,00" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Beschrijving</label>
                <Input placeholder="Beschrijving van het werk" />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNew(false)}>Annuleren</Button>
                <Button>Inplannen</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}>
                <ChevronLeft className="size-4" />
              </Button>
              <h3 className="text-lg font-semibold min-w-[200px] text-center">
                {monthNames[month]} {year}
              </h3>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="size-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={goToToday}>Vandaag</Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 border-t border-l">
            {calendarDays.map((day, index) => {
              const dayInterventions = day ? getInterventionsForDay(day) : []
              const today = isToday(day)

              return (
                <div
                  key={index}
                  className={`min-h-[110px] border-r border-b p-1.5 transition-colors ${
                    !day ? "bg-muted/30" : today ? "bg-primary/5" : "bg-background hover:bg-muted/30"
                  }`}
                >
                  {day && (
                    <>
                      <div className={`text-xs font-medium mb-1 ${
                        today
                          ? "bg-primary text-primary-foreground size-6 rounded-full flex items-center justify-center"
                          : "text-muted-foreground pl-1"
                      }`}>
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {dayInterventions.map((intervention) => {
                          const property = properties.find((p) => p.id === intervention.propertyId)
                          const isSelected = selectedId === intervention.id
                          return (
                            <button
                              key={intervention.id}
                              className={`w-full text-left text-[10px] leading-tight px-1.5 py-1 rounded border-l-2 transition-all hover:bg-muted ${
                                statusBorderColors[intervention.status]
                              } ${isSelected ? "ring-1 ring-primary bg-muted" : "bg-muted/50"}`}
                              onClick={() => setSelectedId(isSelected ? null : intervention.id)}
                            >
                              <div className="font-medium truncate">{intervention.title}</div>
                              <div className="text-muted-foreground truncate">{property?.name}</div>
                            </button>
                          )
                        })}
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Detail Panel */}
      {selectedId && (() => {
        const intervention = interventions.find((i) => i.id === selectedId)
        if (!intervention) return null
        const property = properties.find((p) => p.id === intervention.propertyId)
        return (
          <Card>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-lg">{intervention.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{intervention.description}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm">
                    <span className="text-muted-foreground">Pand: <span className="font-medium text-foreground">{property?.name}</span></span>
                    <span className="text-muted-foreground">Vakman: <span className="font-medium text-foreground">{intervention.workerName}</span></span>
                    <span className="text-muted-foreground">Datum: <span className="font-medium text-foreground">{intervention.scheduledDate}</span></span>
                    <span className="text-muted-foreground">Kosten: <span className="font-medium text-foreground">&euro;{intervention.cost.toLocaleString()}</span></span>
                  </div>
                </div>
                <Badge className={`${statusDotColors[intervention.status]} text-white border-0`}>
                  {statusLabels[intervention.status]}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )
      })()}

      {/* Legend */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-1.5"><div className="size-3 rounded-full bg-blue-500" /> Gepland</div>
        <div className="flex items-center gap-1.5"><div className="size-3 rounded-full bg-orange-500" /> In Uitvoering</div>
        <div className="flex items-center gap-1.5"><div className="size-3 rounded-full bg-green-500" /> Voltooid</div>
      </div>
    </div>
  )
}
