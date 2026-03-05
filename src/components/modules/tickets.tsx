"use client"

import { useState } from "react"
import { Search, AlertCircle, Clock, CheckCircle2, XCircle, GripVertical } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { tickets as initialTickets, properties, workers } from "@/lib/mock-data"
import type { Ticket } from "@/lib/mock-data"

const priorityColors: Record<string, string> = {
  low: "bg-gray-500/10 text-gray-600 border-gray-500/30",
  medium: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  high: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  urgent: "bg-red-500/10 text-red-600 border-red-500/30",
}

const priorityLabels: Record<string, string> = {
  low: "Laag", medium: "Gemiddeld", high: "Hoog", urgent: "Dringend",
}

const categoryLabels: Record<string, string> = {
  plumbing: "Sanitair", electrical: "Elektriciteit", hvac: "HVAC", structural: "Structureel", appliance: "Apparaat", other: "Overig",
}

type ColumnDef = {
  id: Ticket["status"]
  title: string
  icon: typeof AlertCircle
  color: string
  headerBg: string
}

const columns: ColumnDef[] = [
  { id: "open", title: "Open", icon: AlertCircle, color: "text-blue-500", headerBg: "bg-blue-500/10" },
  { id: "in-progress", title: "In Behandeling", icon: Clock, color: "text-orange-500", headerBg: "bg-orange-500/10" },
  { id: "resolved", title: "Opgelost", icon: CheckCircle2, color: "text-green-500", headerBg: "bg-green-500/10" },
  { id: "closed", title: "Gesloten", icon: XCircle, color: "text-gray-500", headerBg: "bg-gray-500/10" },
]

export function TicketsModule() {
  const [search, setSearch] = useState("")
  const [ticketList, setTicketList] = useState<Ticket[]>(initialTickets)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dragOverCol, setDragOverCol] = useState<string | null>(null)

  const filtered = ticketList.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.tenantName.toLowerCase().includes(search.toLowerCase())
  )

  const handleDragStart = (e: React.DragEvent, ticketId: string) => {
    setDraggedId(ticketId)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", ticketId)
  }

  const handleDragEnd = () => {
    setDraggedId(null)
    setDragOverCol(null)
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (dragOverCol !== columnId) setDragOverCol(columnId)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const { clientX, clientY } = e
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
      setDragOverCol(null)
    }
  }

  const handleDrop = (e: React.DragEvent, columnId: Ticket["status"]) => {
    e.preventDefault()
    const ticketId = e.dataTransfer.getData("text/plain")
    if (ticketId) {
      setTicketList((prev) =>
        prev.map((t) => t.id === ticketId ? { ...t, status: columnId, updatedAt: new Date().toISOString() } : t)
      )
    }
    setDraggedId(null)
    setDragOverCol(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tickets</h2>
        <p className="text-muted-foreground">Sleep tickets tussen kolommen om de status te wijzigen</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Zoek tickets..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => {
          const columnTickets = filtered.filter((t) => t.status === column.id)
          const Icon = column.icon
          const isOver = dragOverCol === column.id

          return (
            <div
              key={column.id}
              className={`rounded-xl border-2 transition-all duration-200 min-h-[420px] flex flex-col ${
                isOver
                  ? "border-primary bg-primary/5 scale-[1.01]"
                  : "border-border bg-muted/20"
              }`}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className={`flex items-center gap-2 p-3 rounded-t-[10px] ${column.headerBg}`}>
                <Icon className={`size-4 ${column.color}`} />
                <h3 className="font-semibold text-sm">{column.title}</h3>
                <Badge variant="secondary" className="ml-auto text-xs">{columnTickets.length}</Badge>
              </div>

              <div className="p-2 space-y-2 flex-1">
                {columnTickets.map((ticket) => {
                  const property = properties.find((p) => p.id === ticket.propertyId)
                  const worker = ticket.assignedTo ? workers.find((w) => w.id === ticket.assignedTo) : null
                  const isDragged = draggedId === ticket.id

                  return (
                    <Card
                      key={ticket.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, ticket.id)}
                      onDragEnd={handleDragEnd}
                      className={`cursor-grab active:cursor-grabbing transition-all duration-200 ${
                        isDragged ? "opacity-30 scale-95 rotate-1" : "shadow-sm hover:shadow-md"
                      }`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start gap-2">
                          <GripVertical className="size-4 text-muted-foreground/30 mt-0.5 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-medium leading-tight">{ticket.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{ticket.description}</p>

                            <div className="flex flex-wrap gap-1 mt-2">
                              <Badge variant="outline" className={`text-[10px] ${priorityColors[ticket.priority]}`}>
                                {priorityLabels[ticket.priority]}
                              </Badge>
                              <Badge variant="secondary" className="text-[10px]">
                                {categoryLabels[ticket.category]}
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                              <span>{property?.name}</span>
                              <span>{new Date(ticket.createdAt).toLocaleDateString("nl-BE")}</span>
                            </div>

                            {worker && (
                              <div className="mt-1.5 text-xs text-muted-foreground flex items-center gap-1">
                                <div className="size-4 rounded-full bg-primary/10 flex items-center justify-center text-[8px] font-bold text-primary">
                                  {worker.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                {worker.name}
                              </div>
                            )}

                            <p className="text-xs text-muted-foreground mt-1">{ticket.tenantName}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {columnTickets.length === 0 && (
                  <div className={`text-center py-8 text-xs text-muted-foreground rounded-lg border-2 border-dashed transition-colors ${
                    isOver ? "border-primary text-primary" : "border-muted"
                  }`}>
                    {isOver ? "Laat hier los" : "Geen tickets"}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
