"use client"

import { useState } from "react"
import { Plus, Wrench, Calendar, Clock, ChevronLeft, ChevronRight, List, CheckCircle2, FileText, CircleDot, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { interventions, properties, workers, owners } from "@/lib/mock-data"
import type { Intervention } from "@/lib/mock-data"

// ── Workflow configuration ────────────────────────────────────────────────────

const workflowSteps: { key: Intervention["status"]; label: string; short: string }[] = [
  { key: "offerte_aangevraagd", label: "Offerte aangevraagd", short: "Offerte" },
  { key: "offerte_ontvangen", label: "Offerte ontvangen", short: "Ontvangen" },
  { key: "goedkeuring_nodig", label: "Goedkeuring nodig", short: "Goedkeuring" },
  { key: "goedgekeurd", label: "Goedgekeurd", short: "Goedgekeurd" },
  { key: "ingepland", label: "Ingepland", short: "Ingepland" },
  { key: "in_uitvoering", label: "In uitvoering", short: "Uitvoering" },
  { key: "uitgevoerd", label: "Uitgevoerd", short: "Uitgevoerd" },
  { key: "bevestigd", label: "Bevestigd", short: "Bevestigd" },
  { key: "gefactureerd", label: "Gefactureerd", short: "Gefactureerd" },
]

const statusLabels: Record<string, string> = Object.fromEntries(workflowSteps.map((s) => [s.key, s.label]))

function getStepIndex(status: Intervention["status"]): number {
  return workflowSteps.findIndex((s) => s.key === status)
}

const statusDotColors: Record<string, string> = {
  offerte_aangevraagd: "bg-gray-400",
  offerte_ontvangen: "bg-blue-400",
  goedkeuring_nodig: "bg-amber-500",
  goedgekeurd: "bg-emerald-500",
  ingepland: "bg-blue-500",
  in_uitvoering: "bg-orange-500",
  uitgevoerd: "bg-teal-500",
  bevestigd: "bg-green-500",
  gefactureerd: "bg-purple-500",
}

const statusBadgeColors: Record<string, string> = {
  offerte_aangevraagd: "bg-gray-500/10 text-gray-600 border-gray-500/30",
  offerte_ontvangen: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  goedkeuring_nodig: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  goedgekeurd: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  ingepland: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  in_uitvoering: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  uitgevoerd: "bg-teal-500/10 text-teal-600 border-teal-500/30",
  bevestigd: "bg-green-500/10 text-green-600 border-green-500/30",
  gefactureerd: "bg-purple-500/10 text-purple-600 border-purple-500/30",
}

const statusBorderColors: Record<string, string> = {
  offerte_aangevraagd: "border-l-gray-400",
  offerte_ontvangen: "border-l-blue-400",
  goedkeuring_nodig: "border-l-amber-500",
  goedgekeurd: "border-l-emerald-500",
  ingepland: "border-l-blue-500",
  in_uitvoering: "border-l-orange-500",
  uitgevoerd: "border-l-teal-500",
  bevestigd: "border-l-green-500",
  gefactureerd: "border-l-purple-500",
}

// ── Action buttons per status ─────────────────────────────────────────────────

function getActionLabel(status: Intervention["status"]): string | null {
  switch (status) {
    case "offerte_aangevraagd": return null
    case "offerte_ontvangen": return "Offerte goedkeuren"
    case "goedkeuring_nodig": return "Goedkeuren"
    case "goedgekeurd": return "Inplannen"
    case "ingepland": return "Start uitvoering"
    case "in_uitvoering": return "Markeer als uitgevoerd"
    case "uitgevoerd": return "Bevestigen"
    case "bevestigd": return "Factureren"
    case "gefactureerd": return null
  }
}

// ── Workflow step indicator component ─────────────────────────────────────────

function WorkflowIndicator({ status }: { status: Intervention["status"] }) {
  const activeIdx = getStepIndex(status)

  return (
    <div className="flex items-center w-full overflow-x-auto gap-0">
      {workflowSteps.map((step, idx) => {
        const isCompleted = idx < activeIdx
        const isActive = idx === activeIdx
        const isFuture = idx > activeIdx

        return (
          <div key={step.key} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center">
              <div
                className={`flex size-7 items-center justify-center rounded-full border-2 transition-colors ${
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : isActive
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-muted border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <span className="text-[10px] font-bold">{idx + 1}</span>
                )}
              </div>
              <span
                className={`text-[9px] mt-1 text-center leading-tight max-w-[60px] ${
                  isActive ? "font-semibold text-foreground" : isCompleted ? "text-green-600" : "text-muted-foreground"
                }`}
              >
                {step.short}
              </span>
            </div>
            {idx < workflowSteps.length - 1 && (
              <div
                className={`h-0.5 w-4 mx-0.5 mt-[-14px] ${
                  isCompleted ? "bg-green-500" : "bg-muted-foreground/20"
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Calendar helpers ──────────────────────────────────────────────────────────

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

// ══════════════════════════════════════════════════════════════════════════════
// Main component
// ══════════════════════════════════════════════════════════════════════════════

export function InterventionsModule() {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1))
  const [showNew, setShowNew] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  // ── KPI data ──────────────────────────────────────────────────────────────
  const totalCost = interventions.reduce((s, i) => s + i.cost, 0)
  const totalQuoted = interventions.reduce((s, i) => s + (i.quotedCost || 0), 0)

  // Count per workflow phase
  const phaseCounts: Record<string, number> = {}
  for (const step of workflowSteps) phaseCounts[step.key] = 0
  for (const intv of interventions) phaseCounts[intv.status] = (phaseCounts[intv.status] || 0) + 1

  const earlyPhase = interventions.filter((i) => getStepIndex(i.status) <= 3).length
  const activePhase = interventions.filter((i) => {
    const idx = getStepIndex(i.status)
    return idx >= 4 && idx <= 5
  }).length
  const completedPhase = interventions.filter((i) => getStepIndex(i.status) >= 6).length

  // ── Calendar helpers ──────────────────────────────────────────────────────
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

  const isToday = (day: number | null): boolean => day === 7 && month === 2 && year === 2026

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Interventies</h2>
          <p className="text-muted-foreground">Workflow, gepland onderhoud en werkorders</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode("list")}
            >
              <List className="size-4 mr-1" /> Lijst
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode("calendar")}
            >
              <Calendar className="size-4 mr-1" /> Kalender
            </Button>
          </div>
          <Button onClick={() => setShowNew(!showNew)}>
            <Plus className="size-4 mr-2" /> Interventie Plannen
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-amber-500/10">
              <FileText className="size-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{earlyPhase}</p>
              <p className="text-xs text-muted-foreground">Offerte / Goedkeuring</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-orange-500/10">
              <Clock className="size-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activePhase}</p>
              <p className="text-xs text-muted-foreground">Ingepland / In uitvoering</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="size-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedPhase}</p>
              <p className="text-xs text-muted-foreground">Uitgevoerd / Afgerond</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
              <Wrench className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">&euro;{(totalQuoted || totalCost).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Totaal begroot</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflow phase overview */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            {workflowSteps.map((step) => (
              <div key={step.key} className="flex items-center gap-1.5 text-sm">
                <div className={`size-3 rounded-full ${statusDotColors[step.key]}`} />
                <span className="text-muted-foreground">{step.short}:</span>
                <span className="font-semibold">{phaseCounts[step.key]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Intervention Form */}
      {showNew && (
        <Card>
          <CardHeader>
            <CardTitle>Nieuwe Interventie Aanvragen</CardTitle>
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
                <label className="text-sm font-medium">Beschrijving</label>
                <Input placeholder="Beschrijving van het werk" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Geschatte Kosten</label>
                <Input type="number" placeholder="0,00" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Startstatus</label>
                <div className="flex items-center gap-2 h-9 px-3 border rounded-md bg-muted/50">
                  <CircleDot className="size-4 text-gray-400" />
                  <span className="text-sm">Offerte aangevraagd</span>
                </div>
              </div>
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNew(false)}>Annuleren</Button>
                <Button onClick={() => { alert("Interventie aangevraagd - offerte wordt aangevraagd bij vakman"); setShowNew(false) }}>Offerte Aanvragen</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          LIST VIEW
         ══════════════════════════════════════════════════════════════════════ */}
      {viewMode === "list" && (
        <div className="space-y-4">
          {interventions.map((intervention) => {
            const property = properties.find((p) => p.id === intervention.propertyId)
            const worker = workers.find((w) => w.id === intervention.workerId)
            const owner = property ? owners.find((o) => o.propertyIds.includes(property.id)) : null
            const actionLabel = getActionLabel(intervention.status)
            const needsApproval = intervention.status === "offerte_ontvangen" || intervention.status === "goedkeuring_nodig"
            const overMandate = needsApproval && owner && (intervention.quotedCost || intervention.cost) > owner.repairMandate

            return (
              <Card key={intervention.id}>
                <CardContent className="p-5 space-y-4">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {worker && (
                        <Avatar className="size-10 shrink-0 mt-0.5">
                          <AvatarImage src={worker.photoUrl} alt={worker.name} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">{worker.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-lg">{intervention.title}</h4>
                        <Badge variant="outline" className={statusBadgeColors[intervention.status]}>
                          {statusLabels[intervention.status]}
                        </Badge>
                        {intervention.ticketId && (
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30 text-xs">
                            Vanuit ticket
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{intervention.description}</p>
                    </div>
                    </div>
                  </div>

                  {/* Info row */}
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <span className="text-muted-foreground">
                      Pand: <span className="font-medium text-foreground">{property?.name}</span>
                    </span>
                    {intervention.workerName && (
                      <span className="text-muted-foreground">
                        Vakman: <span className="font-medium text-foreground">{intervention.workerName}</span>
                      </span>
                    )}
                    {intervention.scheduledDate && (
                      <span className="text-muted-foreground">
                        Datum: <span className="font-medium text-foreground">{intervention.scheduledDate}</span>
                      </span>
                    )}
                    {intervention.quotedCost !== null && (
                      <span className="text-muted-foreground">
                        Offerte: <span className="font-medium text-foreground">&euro;{intervention.quotedCost.toLocaleString()}</span>
                      </span>
                    )}
                    {intervention.cost > 0 && (
                      <span className="text-muted-foreground">
                        Kosten: <span className="font-medium text-foreground">&euro;{intervention.cost.toLocaleString()}</span>
                      </span>
                    )}
                    {intervention.approvedBy && (
                      <span className="text-muted-foreground">
                        Goedgekeurd door: <span className="font-medium text-foreground">{intervention.approvedBy}</span>
                      </span>
                    )}
                  </div>

                  {/* Mandate warning */}
                  {overMandate && (
                    <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-500/10 rounded-md px-3 py-2">
                      <AlertCircle className="size-4 flex-shrink-0" />
                      <span>
                        Bedrag (&euro;{(intervention.quotedCost || intervention.cost).toLocaleString()}) overschrijdt reparatiemandaat van eigenaar {owner?.name} (&euro;{owner?.repairMandate.toLocaleString()}) - goedkeuring eigenaar vereist
                      </span>
                    </div>
                  )}

                  {/* Workflow indicator */}
                  <WorkflowIndicator status={intervention.status} />

                  {/* Confirmation status and action */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      {getStepIndex(intervention.status) >= 6 && (
                        <>
                          <span>
                            Huurder bevestigd: {intervention.tenantConfirmed ? (
                              <span className="text-green-600 font-medium">Ja</span>
                            ) : (
                              <span className="text-orange-600 font-medium">Nee</span>
                            )}
                          </span>
                          <span>
                            Aannemer bevestigd: {intervention.contractorConfirmed ? (
                              <span className="text-green-600 font-medium">Ja</span>
                            ) : (
                              <span className="text-orange-600 font-medium">Nee</span>
                            )}
                          </span>
                        </>
                      )}
                    </div>
                    {actionLabel && (
                      <Button
                        size="sm"
                        variant={needsApproval ? "default" : "outline"}
                        onClick={() => alert(`Actie: ${actionLabel} voor "${intervention.title}"`)}
                      >
                        {actionLabel}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          CALENDAR VIEW
         ══════════════════════════════════════════════════════════════════════ */}
      {viewMode === "calendar" && (
        <>
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

          {/* Detail Panel (calendar view) */}
          {selectedId && (() => {
            const intervention = interventions.find((i) => i.id === selectedId)
            if (!intervention) return null
            const property = properties.find((p) => p.id === intervention.propertyId)
            const actionLabel = getActionLabel(intervention.status)
            return (
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-lg">{intervention.title}</h4>
                        <Badge variant="outline" className={statusBadgeColors[intervention.status]}>
                          {statusLabels[intervention.status]}
                        </Badge>
                        {intervention.ticketId && (
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30 text-xs">
                            Vanuit ticket
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{intervention.description}</p>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm">
                        <span className="text-muted-foreground">Pand: <span className="font-medium text-foreground">{property?.name}</span></span>
                        {intervention.workerName && <span className="text-muted-foreground">Vakman: <span className="font-medium text-foreground">{intervention.workerName}</span></span>}
                        <span className="text-muted-foreground">Datum: <span className="font-medium text-foreground">{intervention.scheduledDate}</span></span>
                        {intervention.quotedCost !== null && <span className="text-muted-foreground">Offerte: <span className="font-medium text-foreground">&euro;{intervention.quotedCost.toLocaleString()}</span></span>}
                        {intervention.cost > 0 && <span className="text-muted-foreground">Kosten: <span className="font-medium text-foreground">&euro;{intervention.cost.toLocaleString()}</span></span>}
                      </div>
                    </div>
                    {actionLabel && (
                      <Button size="sm" onClick={() => alert(`Actie: ${actionLabel} voor "${intervention.title}"`)}>
                        {actionLabel}
                      </Button>
                    )}
                  </div>
                  <WorkflowIndicator status={intervention.status} />
                </CardContent>
              </Card>
            )
          })()}

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm">
            {workflowSteps.map((step) => (
              <div key={step.key} className="flex items-center gap-1.5">
                <div className={`size-3 rounded-full ${statusDotColors[step.key]}`} />
                {step.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
