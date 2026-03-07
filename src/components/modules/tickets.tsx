"use client"

import { useState } from "react"
import { Search, AlertCircle, Clock, CheckCircle2, XCircle, GripVertical, Plus, Camera, ArrowLeft, MapPin, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { tickets as initialTickets, properties, workers, tenants } from "@/lib/mock-data"
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
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  // New ticket form state
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newPropertyId, setNewPropertyId] = useState("")
  const [newCategory, setNewCategory] = useState("")
  const [newPriority, setNewPriority] = useState("")
  const [newAssignedTo, setNewAssignedTo] = useState("")

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

  const handleCreateTicket = () => {
    const property = properties.find((p) => p.id === newPropertyId)
    if (!newTitle || !newPropertyId || !newCategory || !newPriority) return

    const newTicket: Ticket = {
      id: `tk-new-${Date.now()}`,
      propertyId: newPropertyId,
      tenantId: property?.tenant?.id || "",
      tenantName: property?.tenant?.name || "Beheerder",
      title: newTitle,
      description: newDescription,
      category: newCategory as Ticket["category"],
      priority: newPriority as Ticket["priority"],
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: newAssignedTo || null,
    }

    setTicketList((prev) => [newTicket, ...prev])
    setAddOpen(false)
    setNewTitle("")
    setNewDescription("")
    setNewPropertyId("")
    setNewCategory("")
    setNewPriority("")
    setNewAssignedTo("")
  }

  if (selectedTicket) {
    const property = properties.find((p) => p.id === selectedTicket.propertyId)
    const worker = selectedTicket.assignedTo ? workers.find((w) => w.id === selectedTicket.assignedTo) : null

    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => setSelectedTicket(null)}>
          <ArrowLeft className="size-4 mr-1" /> Terug naar Tickets
        </Button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              {(() => { const t = tenants.find(t => t.id === selectedTicket.tenantId); return t ? <AvatarImage src={t.photoUrl} alt={selectedTicket.tenantName} /> : null })()}
              <AvatarFallback className="bg-primary/10 text-primary">{selectedTicket.tenantName.split(" ").map(n => n[0]).join("").slice(0,2)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{selectedTicket.title}</h2>
              <p className="text-muted-foreground">{property?.name} &middot; {selectedTicket.tenantName}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className={priorityColors[selectedTicket.priority]}>{priorityLabels[selectedTicket.priority]}</Badge>
            <Badge variant="secondary">{categoryLabels[selectedTicket.category]}</Badge>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between"><span className="text-muted-foreground">Beschrijving</span></div>
              <p className="text-sm">{selectedTicket.description}</p>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Aangemaakt</span><span className="text-sm font-medium">{new Date(selectedTicket.createdAt).toLocaleDateString("nl-BE")} {new Date(selectedTicket.createdAt).toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit" })}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Laatst bijgewerkt</span><span className="text-sm font-medium">{new Date(selectedTicket.updatedAt).toLocaleDateString("nl-BE")} {new Date(selectedTicket.updatedAt).toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit" })}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Pand</span><span className="text-sm font-medium">{property?.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Adres</span><span className="text-sm font-medium">{property?.address}, {property?.city}</span></div>
              {worker && <div className="flex justify-between"><span className="text-muted-foreground">Toegewezen aan</span><span className="text-sm font-medium">{worker.name} ({worker.phone})</span></div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Camera className="size-5" /> Foto&#39;s &amp; Documenten</CardTitle></CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                <Camera className="size-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Sleep foto&#39;s of documenten hierheen</p>
                <p className="text-xs mt-1">PV politie, foto&#39;s schade, offertes, ...</p>
                <Button size="sm" variant="outline" className="mt-3">Bestanden Uploaden</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Activiteitenlog</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-3 text-sm"><div className="size-2 rounded-full bg-blue-500 mt-1.5 shrink-0" /><div><span className="font-medium">Ticket aangemaakt</span> door {selectedTicket.tenantName}<br /><span className="text-xs text-muted-foreground">{new Date(selectedTicket.createdAt).toLocaleDateString("nl-BE")}</span></div></div>
              {worker && <div className="flex gap-3 text-sm"><div className="size-2 rounded-full bg-orange-500 mt-1.5 shrink-0" /><div><span className="font-medium">Toegewezen aan</span> {worker.name}<br /><span className="text-xs text-muted-foreground">{new Date(selectedTicket.updatedAt).toLocaleDateString("nl-BE")}</span></div></div>}
              {selectedTicket.status === "resolved" && <div className="flex gap-3 text-sm"><div className="size-2 rounded-full bg-green-500 mt-1.5 shrink-0" /><div><span className="font-medium">Opgelost</span><br /><span className="text-xs text-muted-foreground">{new Date(selectedTicket.updatedAt).toLocaleDateString("nl-BE")}</span></div></div>}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tickets</h2>
        <p className="text-muted-foreground">Sleep tickets tussen kolommen om de status te wijzigen</p>
      </div>

      <div className="flex gap-3">
        <Button onClick={() => setAddOpen(true)}><Plus className="size-4 mr-2" /> Nieuw Ticket</Button>
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
                      onClick={() => setSelectedTicket(ticket)}
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
                                <Avatar className="size-4">
                                  <AvatarImage src={worker.photoUrl} alt={worker.name} />
                                  <AvatarFallback className="text-[6px] bg-primary/10 text-primary">{worker.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                                </Avatar>
                                {worker.name}
                              </div>
                            )}

                            {(() => { const tenant = tenants.find(t => t.id === ticket.tenantId); return (
                              <div className="mt-1.5 text-xs text-muted-foreground flex items-center gap-1">
                                <Avatar className="size-4">
                                  {tenant && <AvatarImage src={tenant.photoUrl} alt={ticket.tenantName} />}
                                  <AvatarFallback className="text-[6px] bg-muted">{ticket.tenantName.split(" ").map(n => n[0]).join("").slice(0,2)}</AvatarFallback>
                                </Avatar>
                                {ticket.tenantName}
                              </div>
                            )})()}
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

      {/* Nieuw Ticket Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nieuw Ticket Aanmaken</DialogTitle>
            <DialogDescription>Maak handmatig een nieuw onderhoud- of herstellingsticket aan</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Titel</label>
              <Input placeholder="Bijv. Lekkende kraan badkamer" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Beschrijving</label>
              <Textarea placeholder="Gedetailleerde omschrijving van het probleem..." value={newDescription} onChange={(e) => setNewDescription(e.target.value)} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Pand</label>
                <Select value={newPropertyId} onValueChange={setNewPropertyId}>
                  <SelectTrigger><SelectValue placeholder="Selecteer pand" /></SelectTrigger>
                  <SelectContent>
                    {properties.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Categorie</label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger><SelectValue placeholder="Selecteer categorie" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Prioriteit</label>
                <Select value={newPriority} onValueChange={setNewPriority}>
                  <SelectTrigger><SelectValue placeholder="Selecteer prioriteit" /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Toewijzen aan (optioneel)</label>
                <Select value={newAssignedTo} onValueChange={setNewAssignedTo}>
                  <SelectTrigger><SelectValue placeholder="Selecteer vakman" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Niet toegewezen</SelectItem>
                    {workers.map((w) => (
                      <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Annuleren</Button>
            <Button onClick={handleCreateTicket} disabled={!newTitle || !newPropertyId || !newCategory || !newPriority}>Ticket Aanmaken</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
