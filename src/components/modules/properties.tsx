"use client"

import { useState } from "react"
import {
  Search, Building2, Bed, Bath, Ruler, Home, Store, FolderArchive, FileText,
  Upload, Shield, ChevronRight, ClipboardCheck, Camera, Clock, AlertTriangle,
  CheckCircle2, AlertCircle, XCircle, Plus, ChevronDown, ChevronUp, Eye,
  ImageIcon, MapPin, Phone, Car, Warehouse, ArrowUpDown, Users, PawPrint,
  Cigarette, Ticket, FileSpreadsheet, FileImage, FileVideo, FileArchive, FileType2, BookOpen
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { properties, asBuiltDocuments, insurancePolicies, propertyInspections, owners, tickets } from "@/lib/mock-data"
import type { Property, PropertyInspection, InspectionItem } from "@/lib/mock-data"

// ── Constants ────────────────────────────────────────────────────────────────

const TODAY = new Date("2026-03-07")

const docTypeIcon: Record<string, { icon: typeof FileText; color: string }> = {
  pdf: { icon: FileText, color: "text-red-500 bg-red-500/10" },
  word: { icon: FileType2, color: "text-blue-600 bg-blue-500/10" },
  excel: { icon: FileSpreadsheet, color: "text-green-600 bg-green-500/10" },
  image: { icon: FileImage, color: "text-purple-500 bg-purple-500/10" },
  photo: { icon: FileImage, color: "text-purple-500 bg-purple-500/10" },
  video: { icon: FileVideo, color: "text-pink-500 bg-pink-500/10" },
  zip: { icon: FileArchive, color: "text-yellow-600 bg-yellow-500/10" },
  blueprint: { icon: Ruler, color: "text-cyan-600 bg-cyan-500/10" },
  certificate: { icon: Shield, color: "text-emerald-600 bg-emerald-500/10" },
  report: { icon: FileText, color: "text-orange-500 bg-orange-500/10" },
  datasheet: { icon: FileSpreadsheet, color: "text-indigo-500 bg-indigo-500/10" },
  manual: { icon: BookOpen, color: "text-amber-600 bg-amber-500/10" },
}

const statusLabels: Record<string, string> = {
  occupied: "Verhuurd",
  available: "Beschikbaar",
  maintenance: "Onderhoud",
  new: "Nieuw",
}

const statusColors: Record<string, { badge: string; dot: string; border: string; titleBg: string }> = {
  occupied: { badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20", dot: "bg-emerald-500", border: "border-l-emerald-500", titleBg: "bg-emerald-500/8 dark:bg-emerald-500/15" },
  available: { badge: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20", dot: "bg-blue-500", border: "border-l-blue-500", titleBg: "bg-blue-500/8 dark:bg-blue-500/15" },
  maintenance: { badge: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20", dot: "bg-amber-500", border: "border-l-amber-500", titleBg: "bg-amber-500/8 dark:bg-amber-500/15" },
  new: { badge: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20", dot: "bg-purple-500", border: "border-l-purple-500", titleBg: "bg-purple-500/8 dark:bg-purple-500/15" },
}

const typeLabels: Record<string, string> = {
  apartment: "Appartement",
  house: "Huis",
  studio: "Studio",
  commercial: "Commercieel",
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  apartment: Building2,
  house: Home,
  studio: Bed,
  commercial: Store,
}

const conditionConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  "goed": { label: "Goed", color: "bg-green-500/10 text-green-600 border-green-500/30", icon: CheckCircle2 },
  "licht gebrek": { label: "Licht gebrek", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30", icon: AlertCircle },
  "gebrek": { label: "Gebrek", color: "bg-orange-500/10 text-orange-600 border-orange-500/30", icon: AlertTriangle },
  "ernstig gebrek": { label: "Ernstig gebrek", color: "bg-red-500/10 text-red-600 border-red-500/30", icon: XCircle },
}

const inspectionTypeLabels: Record<string, string> = {
  intrede: "Intrede",
  uittrede: "Uittrede",
  tussentijds: "Tussentijds",
}

const ticketStatusLabels: Record<string, string> = {
  open: "Open",
  "in-progress": "In behandeling",
  resolved: "Opgelost",
  closed: "Gesloten",
}

const ticketStatusColors: Record<string, string> = {
  open: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  "in-progress": "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  resolved: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  closed: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
}

const ticketPriorityLabels: Record<string, string> = {
  low: "Laag",
  medium: "Gemiddeld",
  high: "Hoog",
  urgent: "Dringend",
}

const ticketPriorityColors: Record<string, string> = {
  low: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  medium: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  high: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  urgent: "bg-red-500/10 text-red-600 border-red-500/20",
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isLeaseExpiringSoon(leaseEnd: string | null): boolean {
  if (!leaseEnd) return false
  const end = new Date(leaseEnd)
  const sixMonthsFromNow = new Date(TODAY)
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6)
  return end <= sixMonthsFromNow && end >= TODAY
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric" })
}

function getInitials(name: string): string {
  return name.split(" ").map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase()
}

// ── Inspection Detail Component ──────────────────────────────────────────────

function InspectionDetail({ inspection, onBack, inspectionPhotos, onUploadPhoto }: {
  inspection: PropertyInspection
  onBack: () => void
  inspectionPhotos: Record<string, string[]>
  onUploadPhoto: (itemId: string, url: string) => void
}) {
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null)
  const [photoViewItem, setPhotoViewItem] = useState<InspectionItem | null>(null)
  const [activeTab, setActiveTab] = useState<"rooms" | "photos" | "defects" | "meters">("rooms")

  const rooms = inspection.items.reduce((acc, item) => {
    if (!acc[item.room]) acc[item.room] = []
    acc[item.room].push(item)
    return acc
  }, {} as Record<string, InspectionItem[]>)

  const totalItems = inspection.items.length
  const goodItems = inspection.items.filter((i) => i.condition === "goed").length
  const defectItems = totalItems - goodItems
  const totalEstimatedCost = inspection.items.reduce((sum, i) => sum + (i.estimatedCost || 0), 0)
  const allPhotos = inspection.items.flatMap((item) => (item.photoUrls || []).map(url => ({ url, item })))
  const conditionPercent = Math.round((goodItems / totalItems) * 100)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>&larr; Terug</Button>
        <div>
          <h3 className="text-lg font-bold">Plaatsbeschrijving - {inspectionTypeLabels[inspection.type]}</h3>
          <p className="text-sm text-muted-foreground">
            {formatDate(inspection.date)} - Inspecteur: {inspection.inspector}
          </p>
        </div>
        <Badge variant={inspection.status === "voltooid" ? "default" : "secondary"} className="ml-auto">
          {inspection.status === "voltooid" ? "Voltooid" : "In behandeling"}
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
        <Card><CardContent className="p-3 text-center"><p className="text-2xl font-bold">{totalItems}</p><p className="text-xs text-muted-foreground">Items</p></CardContent></Card>
        <Card><CardContent className="p-3 text-center"><p className="text-2xl font-bold text-green-600">{goodItems}</p><p className="text-xs text-muted-foreground">In orde</p></CardContent></Card>
        <Card><CardContent className="p-3 text-center"><p className="text-2xl font-bold text-orange-600">{defectItems}</p><p className="text-xs text-muted-foreground">Gebreken</p></CardContent></Card>
        <Card><CardContent className="p-3 text-center"><p className="text-2xl font-bold">{Object.keys(rooms).length}</p><p className="text-xs text-muted-foreground">Ruimtes</p></CardContent></Card>
        <Card><CardContent className="p-3 text-center"><p className="text-2xl font-bold">{allPhotos.length}</p><p className="text-xs text-muted-foreground">Foto&apos;s</p></CardContent></Card>
      </div>

      {/* Condition Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Algemene staat</span>
            <span className="text-sm font-bold">{conditionPercent}% in orde</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden flex">
            <div className="bg-green-500 transition-all" style={{ width: `${(inspection.items.filter(i => i.condition === "goed").length / totalItems) * 100}%` }} />
            <div className="bg-yellow-500 transition-all" style={{ width: `${(inspection.items.filter(i => i.condition === "licht gebrek").length / totalItems) * 100}%` }} />
            <div className="bg-orange-500 transition-all" style={{ width: `${(inspection.items.filter(i => i.condition === "gebrek").length / totalItems) * 100}%` }} />
            <div className="bg-red-500 transition-all" style={{ width: `${(inspection.items.filter(i => i.condition === "ernstig gebrek").length / totalItems) * 100}%` }} />
          </div>
          <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-green-500" />Goed ({inspection.items.filter(i => i.condition === "goed").length})</span>
            <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-yellow-500" />Licht ({inspection.items.filter(i => i.condition === "licht gebrek").length})</span>
            <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-orange-500" />Gebrek ({inspection.items.filter(i => i.condition === "gebrek").length})</span>
            <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-red-500" />Ernstig ({inspection.items.filter(i => i.condition === "ernstig gebrek").length})</span>
          </div>
        </CardContent>
      </Card>

      {/* General Info */}
      <div className="grid gap-3 md:grid-cols-2">
        {inspection.generalNotes && (
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Algemene Opmerkingen</CardTitle></CardHeader>
            <CardContent><p className="text-sm">{inspection.generalNotes}</p></CardContent>
          </Card>
        )}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Details</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {inspection.floorPlanRef && <div className="flex items-center gap-2"><Ruler className="size-4 text-muted-foreground" /><span>Plattegrond: <span className="font-medium">{inspection.floorPlanRef}</span></span></div>}
            {inspection.keyCount && <div className="flex items-center gap-2"><Home className="size-4 text-muted-foreground" /><span>Sleutels overhandigd: <span className="font-medium">{inspection.keyCount} stuks</span></span></div>}
            {totalEstimatedCost > 0 && <div className="flex items-center gap-2"><AlertTriangle className="size-4 text-orange-500" /><span>Geschatte herstellingskosten: <span className="font-medium text-orange-600">&euro;{totalEstimatedCost}</span></span></div>}
            <div className="flex items-center gap-4 pt-1">
              {inspection.signedByTenant !== undefined && <Badge variant={inspection.signedByTenant ? "default" : "outline"} className="text-xs">{inspection.signedByTenant ? <><CheckCircle2 className="size-3 mr-1" />Huurder getekend</> : "Huurder niet getekend"}</Badge>}
              {inspection.signedByOwner !== undefined && <Badge variant={inspection.signedByOwner ? "default" : "outline"} className="text-xs">{inspection.signedByOwner ? <><CheckCircle2 className="size-3 mr-1" />Eigenaar getekend</> : "Eigenaar niet getekend"}</Badge>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b">
        {([
          { key: "rooms", label: "Ruimtes", count: Object.keys(rooms).length },
          { key: "photos", label: "Foto\u2019s", count: allPhotos.length },
          { key: "defects", label: "Gebreken", count: defectItems },
          { key: "meters", label: "Meterstanden" },
        ] as const).map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}{"count" in tab && tab.count !== undefined ? ` (${tab.count})` : ""}
          </button>
        ))}
      </div>

      {/* Tab: Rooms */}
      {activeTab === "rooms" && (
        <div className="space-y-2">
          {Object.entries(rooms).map(([room, items]) => {
            const isExpanded = expandedRoom === room
            const roomDefects = items.filter((i) => i.condition !== "goed").length
            const roomPhotos = items.reduce((sum, i) => sum + (i.photoUrls?.length || 0), 0)
            return (
              <Card key={room}>
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setExpandedRoom(isExpanded ? null : room)}>
                  <div className="flex items-center gap-3">
                    <Home className="size-4 text-muted-foreground" />
                    <span className="font-medium">{room}</span>
                    <Badge variant="outline" className="text-xs">{items.length} items</Badge>
                    <Badge variant="outline" className="text-xs"><Camera className="size-3 mr-1" />{roomPhotos}</Badge>
                    {roomDefects > 0 && <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-600 border-orange-500/30">{roomDefects} {roomDefects === 1 ? "gebrek" : "gebreken"}</Badge>}
                  </div>
                  {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </div>
                {isExpanded && (
                  <CardContent className="pt-0 pb-4">
                    <Separator className="mb-3" />
                    <div className="space-y-4">
                      {items.map((item) => {
                        const config = conditionConfig[item.condition]
                        const CondIcon = config.icon
                        const uploadedPhotos = inspectionPhotos[item.id] || []
                        const itemPhotoUrls = item.photoUrls || []
                        return (
                          <div key={item.id} className="rounded-lg border overflow-hidden">
                            <div className="flex items-start gap-3 p-3">
                              <CondIcon className={`size-5 mt-0.5 shrink-0 ${item.condition === "goed" ? "text-green-500" : item.condition === "licht gebrek" ? "text-yellow-500" : item.condition === "gebrek" ? "text-orange-500" : "text-red-500"}`} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span className="font-medium text-sm">{item.element}</span>
                                  <Badge variant="outline" className={`text-[10px] ${config.color}`}>{config.label}</Badge>
                                  {item.estimatedCost !== undefined && item.estimatedCost > 0 && <Badge variant="outline" className="text-[10px] bg-orange-500/10 text-orange-600 border-orange-500/30">&euro;{item.estimatedCost}</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                                {(item.dimensions || item.materials) && (
                                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                                    {item.dimensions && <span className="flex items-center gap-1"><Ruler className="size-3" />{item.dimensions}</span>}
                                    {item.materials && <span className="flex items-center gap-1"><ClipboardCheck className="size-3" />{item.materials}</span>}
                                  </div>
                                )}
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="size-3" />{new Date(item.timestamp).toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit" })}</span>
                                </div>
                              </div>
                            </div>
                            {/* Inline photos */}
                            {(itemPhotoUrls.length > 0 || uploadedPhotos.length > 0) && (
                              <div className="px-3 pb-3">
                                <div className="grid gap-2 grid-cols-3 sm:grid-cols-4">
                                  {itemPhotoUrls.map((url, idx) => (
                                    <div key={`orig-${idx}`} className="relative aspect-video rounded-lg overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setPhotoViewItem(item)}>
                                      <img src={url} alt={`${item.element} foto ${idx + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                  ))}
                                  {uploadedPhotos.map((url, idx) => (
                                    <div key={`up-${idx}`} className="relative aspect-video rounded-lg overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setPhotoViewItem(item)}>
                                      <img src={url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                                      <span className="absolute top-1 right-1 text-[9px] bg-primary text-primary-foreground px-1 rounded">Nieuw</span>
                                    </div>
                                  ))}
                                  <button
                                    className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer"
                                    onClick={() => {
                                      const input = document.createElement("input")
                                      input.type = "file"; input.accept = "image/*"; input.multiple = true
                                      input.onchange = (ev) => {
                                        const files = (ev.target as HTMLInputElement).files
                                        if (files) Array.from(files).forEach((file) => onUploadPhoto(item.id, URL.createObjectURL(file)))
                                      }
                                      input.click()
                                    }}
                                  >
                                    <Plus className="size-4 text-muted-foreground/50" />
                                    <span className="text-[10px] text-muted-foreground mt-1">Foto</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {/* Tab: All Photos Gallery */}
      {activeTab === "photos" && (
        <Card>
          <CardContent className="p-4">
            {allPhotos.length > 0 ? (
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                {allPhotos.map((photo, idx) => (
                  <div key={idx} className="group relative aspect-video rounded-lg overflow-hidden border cursor-pointer" onClick={() => setPhotoViewItem(photo.item)}>
                    <img src={photo.url} alt={`${photo.item.room} - ${photo.item.element}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <p className="text-white text-xs font-medium">{photo.item.room}</p>
                      <p className="text-white/80 text-[10px]">{photo.item.element}</p>
                    </div>
                    <div className="absolute top-1 right-1">
                      <Badge variant="outline" className={`text-[9px] backdrop-blur-sm ${conditionConfig[photo.item.condition].color}`}>{conditionConfig[photo.item.condition].label}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Camera className="size-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Geen foto&apos;s beschikbaar</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tab: Defects Only */}
      {activeTab === "defects" && (
        <div className="space-y-3">
          {totalEstimatedCost > 0 && (
            <Card className="border-orange-500/30 bg-orange-500/5">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="size-5 text-orange-500" />
                  <div>
                    <p className="font-medium text-sm">Totaal geschatte herstellingskosten</p>
                    <p className="text-xs text-muted-foreground">{defectItems} gebreken gevonden</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-orange-600">&euro;{totalEstimatedCost}</span>
              </CardContent>
            </Card>
          )}
          {inspection.items.filter(i => i.condition !== "goed").map((item) => {
            const config = conditionConfig[item.condition]
            const CondIcon = config.icon
            const itemPhotos = item.photoUrls || []
            return (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <CondIcon className={`size-5 mt-0.5 shrink-0 ${item.condition === "licht gebrek" ? "text-yellow-500" : item.condition === "gebrek" ? "text-orange-500" : "text-red-500"}`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium">{item.room} - {item.element}</span>
                        <Badge variant="outline" className={`text-[10px] ${config.color}`}>{config.label}</Badge>
                        {item.estimatedCost !== undefined && item.estimatedCost > 0 && <Badge variant="outline" className="text-[10px]">&euro;{item.estimatedCost}</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      {itemPhotos.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {itemPhotos.slice(0, 3).map((url, idx) => (
                            <div key={idx} className="relative size-20 rounded-lg overflow-hidden border cursor-pointer" onClick={() => setPhotoViewItem(item)}>
                              <img src={url} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                          {itemPhotos.length > 3 && <div className="flex items-center justify-center size-20 rounded-lg border bg-muted text-xs text-muted-foreground cursor-pointer" onClick={() => setPhotoViewItem(item)}>+{itemPhotos.length - 3}</div>}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {defectItems === 0 && (
            <Card><CardContent className="p-8 text-center text-muted-foreground"><CheckCircle2 className="size-12 mx-auto mb-3 text-green-500 opacity-50" /><p className="font-medium">Geen gebreken gevonden</p><p className="text-sm">Alle items zijn in goede staat.</p></CardContent></Card>
          )}
        </div>
      )}

      {/* Tab: Meter Readings */}
      {activeTab === "meters" && (
        <Card>
          <CardContent className="p-4 space-y-4">
            {inspection.meterReadings && inspection.meterReadings.length > 0 ? (
              <div className="space-y-3">
                {inspection.meterReadings.map((meter, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10"><Ruler className="size-4 text-primary" /></div>
                      <span className="font-medium text-sm">{meter.type}</span>
                    </div>
                    <span className="text-lg font-bold">{meter.value} <span className="text-sm font-normal text-muted-foreground">{meter.unit}</span></span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Ruler className="size-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Geen meterstanden geregistreerd</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Photo Lightbox Dialog */}
      <Dialog open={!!photoViewItem} onOpenChange={() => setPhotoViewItem(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Camera className="size-5" />{photoViewItem?.room} / {photoViewItem?.element}</DialogTitle>
            <DialogDescription>
              {photoViewItem && (
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={conditionConfig[photoViewItem.condition].color}>{conditionConfig[photoViewItem.condition].label}</Badge>
                  {photoViewItem.dimensions && <span className="text-xs">{photoViewItem.dimensions}</span>}
                  {photoViewItem.materials && <span className="text-xs">{photoViewItem.materials}</span>}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          {photoViewItem && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{photoViewItem.description}</p>
              <div className="grid gap-3 grid-cols-2">
                {(photoViewItem.photoUrls || []).map((url, idx) => (
                  <div key={`o-${idx}`} className="relative aspect-video rounded-lg overflow-hidden border"><img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" /></div>
                ))}
                {(inspectionPhotos[photoViewItem.id] || []).map((url, idx) => (
                  <div key={`u-${idx}`} className="relative aspect-video rounded-lg overflow-hidden border">
                    <img src={url} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">Nieuw</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={() => {
                const input = document.createElement("input")
                input.type = "file"; input.accept = "image/*"; input.multiple = true
                input.onchange = (ev) => {
                  const files = (ev.target as HTMLInputElement).files
                  if (files && photoViewItem) { Array.from(files).forEach((file) => { onUploadPhoto(photoViewItem.id, URL.createObjectURL(file)) }) }
                }
                input.click()
              }}>
                <Upload className="size-4 mr-2" /> Foto&#39;s Toevoegen
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ── Contract Dialog Content ──────────────────────────────────────────────────

function ContractDialogContent({ property }: { property: Property }) {
  const owner = owners.find(o => o.id === property.ownerId)

  return (
    <div className="bg-white dark:bg-zinc-900 border rounded-lg p-8 space-y-6 text-sm max-h-[70vh] overflow-y-auto">
      {/* Header */}
      <div className="text-center border-b pb-6">
        <h2 className="text-xl font-bold tracking-tight">HUUROVEREENKOMST</h2>
        <p className="text-muted-foreground mt-1">Woninghuur - Vlaams Gewest</p>
        <p className="text-xs text-muted-foreground mt-2">Referentie: AEP-{property.id.toUpperCase()}</p>
      </div>

      {/* Parties */}
      <div className="space-y-4">
        <h3 className="font-bold text-base border-b pb-1">Artikel 1 - Partijen</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="font-semibold">VERHUURDER:</p>
            <p>{owner?.name ?? "Onbekend"}</p>
            {owner?.company && <p className="text-muted-foreground">{owner.company}</p>}
            <p className="text-muted-foreground">{owner?.email}</p>
            <p className="text-muted-foreground">{owner?.phone}</p>
          </div>
          <div className="space-y-1">
            <p className="font-semibold">HUURDER:</p>
            <p>{property.tenant?.name}</p>
            <p className="text-muted-foreground">{property.tenant?.email}</p>
            <p className="text-muted-foreground">{property.tenant?.phone}</p>
          </div>
        </div>
      </div>

      {/* Property */}
      <div className="space-y-2">
        <h3 className="font-bold text-base border-b pb-1">Artikel 2 - Gehuurde goed</h3>
        <p>Het gehuurde goed betreft een <strong>{typeLabels[property.type].toLowerCase()}</strong> gelegen te:</p>
        <p className="font-medium">{property.address}, {property.zipCode} {property.city}</p>
        <div className="grid grid-cols-2 gap-2 mt-2 text-muted-foreground">
          <p>Oppervlakte: <span className="text-foreground font-medium">{property.sqm} m2</span></p>
          <p>Slaapkamers: <span className="text-foreground font-medium">{property.bedrooms}</span></p>
          <p>Badkamers: <span className="text-foreground font-medium">{property.bathrooms}</span></p>
          <p>Bouwjaar: <span className="text-foreground font-medium">{property.buildingYear}</span></p>
          <p>EPC-score: <span className="text-foreground font-medium">{property.epcScore}</span></p>
          {property.floor !== null && <p>Verdieping: <span className="text-foreground font-medium">{property.floor}</span></p>}
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <h3 className="font-bold text-base border-b pb-1">Artikel 3 - Duur</h3>
        <p>De huurovereenkomst wordt aangegaan voor een periode van:</p>
        <div className="flex gap-4">
          <p>Aanvang: <strong>{property.leaseStart}</strong></p>
          <p>Einde: <strong>{property.leaseEnd}</strong></p>
        </div>
        <p className="text-muted-foreground text-xs">De huurovereenkomst wordt stilzwijgend verlengd tenzij opzegging door een der partijen minstens 3 maanden voor het einde van de lopende periode.</p>
      </div>

      {/* Rent */}
      <div className="space-y-2">
        <h3 className="font-bold text-base border-b pb-1">Artikel 4 - Huurprijs en kosten</h3>
        <div className="space-y-1">
          <div className="flex justify-between"><span>Basishuur:</span><span className="font-medium">&euro;{property.baseRent.toLocaleString()}/maand</span></div>
          <div className="flex justify-between"><span>Gemeenschappelijke kosten:</span><span className="font-medium">&euro;{property.commonCosts.toLocaleString()}/maand</span></div>
          <Separator className="my-2" />
          <div className="flex justify-between font-bold"><span>Totaal maandelijks:</span><span>&euro;{property.monthlyRent.toLocaleString()}/maand</span></div>
        </div>
        <p className="text-muted-foreground text-xs mt-2">De huur wordt maandelijks betaald voor de 5e van elke maand via domiciliering of overschrijving.</p>
      </div>

      {/* Conditions */}
      <div className="space-y-2">
        <h3 className="font-bold text-base border-b pb-1">Artikel 5 - Bijzondere voorwaarden</h3>
        <div className="space-y-1 text-muted-foreground">
          <p>- Huisdieren {property.petsAllowed ? "toegestaan mits overleg" : "niet toegestaan"}.</p>
          <p>- Roken {property.smokingAllowed ? "toegestaan op het balkon/terras" : "niet toegestaan in het gehuurde goed"}.</p>
          <p>- De huurder verbindt zich tot het onderhoud van het gehuurde goed als een goede huisvader.</p>
          <p>- Onderverhuring is niet toegestaan zonder schriftelijke toestemming van de verhuurder.</p>
        </div>
      </div>

      {/* Signatures */}
      <div className="border-t pt-6 mt-6">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-8">
            <p className="font-medium">De verhuurder:</p>
            <div className="border-b border-dashed w-48" />
            <p className="text-xs text-muted-foreground">{owner?.name ?? "Onbekend"}</p>
          </div>
          <div className="space-y-8">
            <p className="font-medium">De huurder:</p>
            <div className="border-b border-dashed w-48" />
            <p className="text-xs text-muted-foreground">{property.tenant?.name}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-6 text-center">Opgesteld in tweevoud te {property.city} op {property.leaseStart}</p>
      </div>
    </div>
  )
}

// ── Main Module ──────────────────────────────────────────────────────────────

export function PropertiesModule() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [contractDialogOpen, setContractDialogOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [selectedInspection, setSelectedInspection] = useState<PropertyInspection | null>(null)
  const [inspectionPhotos, setInspectionPhotos] = useState<Record<string, string[]>>({})
  const [propertyImages, setPropertyImages] = useState<Record<string, string>>({})

  const handleUploadPhoto = (itemId: string, url: string) => {
    setInspectionPhotos((prev) => ({ ...prev, [itemId]: [...(prev[itemId] || []), url] }))
  }

  const handlePropertyImage = (propertyId: string) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (ev) => {
      const file = (ev.target as HTMLInputElement).files?.[0]
      if (file) setPropertyImages((prev) => ({ ...prev, [propertyId]: URL.createObjectURL(file) }))
    }
    input.click()
  }

  const filtered = properties.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.address.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // ── Inspection detail view ─────────────────────────────────────────────────
  if (selectedProperty && selectedInspection) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => setSelectedInspection(null)}>&larr; Terug naar Pandgegevens</Button>
        <InspectionDetail inspection={selectedInspection} onBack={() => setSelectedInspection(null)} inspectionPhotos={inspectionPhotos} onUploadPhoto={handleUploadPhoto} />
      </div>
    )
  }

  // ── Property detail view ───────────────────────────────────────────────────
  if (selectedProperty) {
    const propertyDocs = asBuiltDocuments.filter((d) => d.propertyId === selectedProperty.id)
    const propInspections = propertyInspections.filter((i) => i.propertyId === selectedProperty.id)
    const propTickets = tickets.filter((t) => t.propertyId === selectedProperty.id)
    const owner = owners.find((o) => o.id === selectedProperty.ownerId)
    const leaseExpiring = isLeaseExpiringSoon(selectedProperty.leaseEnd)
    const managementFee = owner ? (selectedProperty.monthlyRent * owner.managementFeePercent / 100) : 0

    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => { setSelectedProperty(null) }}>&larr; Terug naar Panden</Button>

        {/* Contract expiration warning banner */}
        {leaseExpiring && selectedProperty.leaseEnd && (
          <div className="flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <AlertTriangle className="size-5 text-red-600 shrink-0" />
            <div>
              <p className="font-semibold text-red-700 dark:text-red-400">Contract verloopt binnenkort</p>
              <p className="text-sm text-red-600/80 dark:text-red-400/80">
                Het huurcontract voor dit pand verloopt op {formatDate(selectedProperty.leaseEnd)}. Neem contact op met de huurder voor verlenging of opzeg.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{selectedProperty.name}</h2>
            <p className="text-muted-foreground">{selectedProperty.address}, {selectedProperty.zipCode} {selectedProperty.city}</p>
          </div>
          <Badge variant="secondary" className={statusColors[selectedProperty.status].badge}>
            <div className={`size-1.5 rounded-full ${statusColors[selectedProperty.status].dot} mr-1.5`} />
            {statusLabels[selectedProperty.status]}
          </Badge>
        </div>

        {/* Rent breakdown cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Basishuur</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">&euro;{selectedProperty.baseRent.toLocaleString()}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Gemeensch. Kosten</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">&euro;{selectedProperty.commonCosts.toLocaleString()}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Totaal Huur / maand</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-primary">&euro;{selectedProperty.monthlyRent.toLocaleString()}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">Beheersvergoeding {owner && <span className="text-xs">({owner.managementFeePercent}%)</span>}</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">&euro;{managementFee.toFixed(0)}</div><p className="text-xs text-muted-foreground mt-1">Eigenaar: {owner?.name ?? "Onbekend"}</p></CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Property details */}
          <Card>
            <CardHeader><CardTitle>Pandgegevens</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium">{typeLabels[selectedProperty.type]}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Oppervlakte</span><span className="font-medium">{selectedProperty.sqm} m&sup2;</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Slaapkamers</span><span className="font-medium">{selectedProperty.bedrooms}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Badkamers</span><span className="font-medium">{selectedProperty.bathrooms}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Prijs per m&sup2;</span><span className="font-medium">&euro;{(selectedProperty.monthlyRent / selectedProperty.sqm).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Jaarlijkse Inkomsten</span><span className="font-medium">&euro;{(selectedProperty.monthlyRent * 12).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Totale Inkomsten</span><span className="font-medium">&euro;{selectedProperty.totalRevenue.toLocaleString()}</span></div>
            </CardContent>
          </Card>

          {/* Tenant info card with photo */}
          <Card>
            <CardHeader><CardTitle>Huurder Informatie</CardTitle></CardHeader>
            <CardContent>
              {selectedProperty.tenant ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-16">
                      <AvatarImage src={selectedProperty.tenant.photoUrl} alt={selectedProperty.tenant.name} />
                      <AvatarFallback className="text-lg">{getInitials(selectedProperty.tenant.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-lg">{selectedProperty.tenant.name}</p>
                      <p className="text-sm text-muted-foreground">Huurder sinds {formatDate(selectedProperty.tenant.moveInDate)}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <div className="flex justify-between"><span className="text-muted-foreground">E-mail</span><span className="font-medium">{selectedProperty.tenant.email}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Telefoon</span><span className="font-medium">{selectedProperty.tenant.phone}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Huurstart</span><span className="font-medium">{selectedProperty.leaseStart}</span></div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Huurende</span>
                      <span className={`font-medium ${leaseExpiring ? "text-red-600 dark:text-red-400" : ""}`}>
                        {selectedProperty.leaseEnd}
                        {leaseExpiring && " (!!)"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Building2 className="size-10 mb-2 opacity-50" /><p>Geen actieve huurder</p><Button size="sm" className="mt-3">Te Huur Zetten</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Building info + Bewonersinfo */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Building info */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="size-5" />Gebouwinformatie</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between"><span className="text-muted-foreground">Bouwjaar</span><span className="font-medium">{selectedProperty.buildingYear}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Gerenoveerd</span><span className="font-medium">{selectedProperty.renovatedYear ?? "Niet gerenoveerd"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">EPC-score</span><Badge variant="outline" className="font-bold">{selectedProperty.epcScore}</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Verdieping</span><span className="font-medium">{selectedProperty.floor !== null ? selectedProperty.floor : "N/A"}</span></div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><Car className="size-4" /> Parking</span>
                <Badge variant={selectedProperty.hasParking ? "default" : "secondary"}>{selectedProperty.hasParking ? "Ja" : "Nee"}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><Warehouse className="size-4" /> Garage</span>
                <Badge variant={selectedProperty.hasGarage ? "default" : "secondary"}>{selectedProperty.hasGarage ? "Ja" : "Nee"}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><ArrowUpDown className="size-4" /> Lift</span>
                <Badge variant={selectedProperty.hasElevator ? "default" : "secondary"}>{selectedProperty.hasElevator ? "Ja" : "Nee"}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Bewonersinfo */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Users className="size-5" />Bewonersinfo</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><Users className="size-4" /> Gezinsleden</span>
                <span className="font-medium">{selectedProperty.familyMembers !== null ? selectedProperty.familyMembers : "N/A"}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><PawPrint className="size-4" /> Huisdieren toegestaan</span>
                <Badge variant={selectedProperty.petsAllowed ? "default" : "secondary"}>{selectedProperty.petsAllowed ? "Ja" : "Nee"}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><PawPrint className="size-4" /> Huisdieren aanwezig</span>
                <span className="font-medium">{selectedProperty.petsPresent ?? "Geen"}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center gap-2"><Cigarette className="size-4" /> Roken toegestaan</span>
                <Badge variant={selectedProperty.smokingAllowed ? "default" : "secondary"}>{selectedProperty.smokingAllowed ? "Ja" : "Nee"}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedProperty.utilities.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Maandelijkse Nutsvoorzieningen</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {selectedProperty.utilities.map((u) => (<div key={u.name} className="flex items-center justify-between rounded-lg border p-3"><span className="text-sm text-muted-foreground">{u.name}</span><span className="font-medium">&euro;{u.monthlyCost}</span></div>))}
              </div>
              <div className="mt-4 flex justify-between border-t pt-3"><span className="font-medium">Totaal Nutsvoorzieningen</span><span className="font-bold">&euro;{selectedProperty.utilities.reduce((s, u) => s + u.monthlyCost, 0)}/maand</span></div>
            </CardContent>
          </Card>
        )}

        {/* Ticket History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Ticket className="size-5" />Ticket Geschiedenis</CardTitle>
              <Badge variant="outline">{propTickets.length} ticket{propTickets.length !== 1 ? "s" : ""}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {propTickets.length > 0 ? (
              <div className="space-y-3">
                {propTickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-sm">{ticket.title}</p>
                          <Badge variant="outline" className={`text-[10px] ${ticketStatusColors[ticket.status]}`}>{ticketStatusLabels[ticket.status]}</Badge>
                          <Badge variant="outline" className={`text-[10px] ${ticketPriorityColors[ticket.priority]}`}>{ticketPriorityLabels[ticket.priority]}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {ticket.tenantName} &middot; {formatDate(ticket.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Ticket className="size-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Geen tickets voor dit pand</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inspections */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2"><ClipboardCheck className="size-5" />Plaatsbeschrijvingen</CardTitle>
              <Button size="sm" variant="outline"><Plus className="size-4 mr-2" /> Nieuwe Inspectie</Button>
            </div>
          </CardHeader>
          <CardContent>
            {propInspections.length > 0 ? (
              <div className="space-y-3">
                {propInspections.map((insp) => {
                  const defects = insp.items.filter((i) => i.condition !== "goed").length
                  const critical = insp.items.filter((i) => i.condition === "ernstig gebrek").length
                  return (
                    <div key={insp.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors" onClick={() => setSelectedInspection(insp)}>
                      <div className="flex items-center gap-4">
                        <div className={`flex size-10 items-center justify-center rounded-lg ${insp.type === "intrede" ? "bg-blue-500/10" : insp.type === "uittrede" ? "bg-orange-500/10" : "bg-purple-500/10"}`}>
                          <ClipboardCheck className={`size-5 ${insp.type === "intrede" ? "text-blue-500" : insp.type === "uittrede" ? "text-orange-500" : "text-purple-500"}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{inspectionTypeLabels[insp.type]} plaatsbeschrijving</p>
                            <Badge variant={insp.status === "voltooid" ? "default" : "secondary"} className="text-[10px]">{insp.status === "voltooid" ? "Voltooid" : "In behandeling"}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{formatDate(insp.date)} - {insp.inspector}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right text-sm">
                          <p>{insp.items.length} items gecontroleerd</p>
                          <div className="flex items-center gap-2 justify-end">
                            {defects > 0 && <span className="text-orange-600 text-xs">{defects} {defects === 1 ? "gebrek" : "gebreken"}</span>}
                            {critical > 0 && <span className="text-red-600 text-xs font-medium">{critical} ernstig</span>}
                            {defects === 0 && <span className="text-green-600 text-xs">Alles in orde</span>}
                          </div>
                        </div>
                        <ChevronRight className="size-4 text-muted-foreground" />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ClipboardCheck className="size-10 mx-auto mb-2 opacity-30" /><p className="text-sm">Nog geen plaatsbeschrijvingen voor dit pand</p>
                <Button size="sm" variant="outline" className="mt-3"><Plus className="size-4 mr-2" /> Eerste Inspectie Aanmaken</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contract section with Dialog */}
        {selectedProperty.tenant && selectedProperty.leaseStart && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><FileText className="size-5" />Huurcontract</CardTitle>
                <Button size="sm" onClick={() => setContractDialogOpen(true)}><Eye className="size-4 mr-2" />Bekijk Contract</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center justify-between rounded-lg border p-3"><span className="text-sm text-muted-foreground">Referentie</span><span className="font-medium text-sm">AEP-{selectedProperty.id.toUpperCase()}</span></div>
                <div className="flex items-center justify-between rounded-lg border p-3"><span className="text-sm text-muted-foreground">Periode</span><span className="font-medium text-sm">{selectedProperty.leaseStart} &rarr; {selectedProperty.leaseEnd}</span></div>
                <div className="flex items-center justify-between rounded-lg border p-3"><span className="text-sm text-muted-foreground">Huurprijs</span><span className="font-medium text-sm">&euro;{selectedProperty.monthlyRent.toLocaleString()}/mnd</span></div>
                <div className="flex items-center justify-between rounded-lg border p-3"><span className="text-sm text-muted-foreground">Huurder</span><span className="font-medium text-sm">{selectedProperty.tenant.name}</span></div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contract Dialog */}
        <Dialog open={contractDialogOpen} onOpenChange={setContractDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="flex items-center gap-2"><FileText className="size-5" />Huurcontract - {selectedProperty.name}</DialogTitle>
              <DialogDescription>Contract referentie AEP-{selectedProperty.id.toUpperCase()}</DialogDescription>
            </DialogHeader>
            <div className="p-6 pt-2">
              <ContractDialogContent property={selectedProperty} />
            </div>
          </DialogContent>
        </Dialog>

        {/* Insurance */}
        {(() => {
          const propInsurance = insurancePolicies.filter((i) => i.propertyId === selectedProperty.id)
          return propInsurance.length > 0 ? (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="size-5" />Verzekeringen</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {propInsurance.map((ins) => (
                    <div key={ins.id} className="rounded-lg border p-3 space-y-2">
                      <div className="flex items-center justify-between"><span className="font-medium text-sm">{ins.type}</span><Badge variant="secondary" className="text-xs">{ins.holder === "owner" ? "Eigenaar" : "Huurder"}</Badge></div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex justify-between"><span>Verzekeraar</span><span className="font-medium text-foreground">{ins.company}</span></div>
                        <div className="flex justify-between"><span>Polisnr.</span><span className="font-medium text-foreground">{ins.policyNumber}</span></div>
                        <div className="flex justify-between"><span>Premie</span><span className="font-medium text-foreground">&euro;{ins.annualPremium}/jaar</span></div>
                        <div className="flex justify-between"><span>Geldig</span><span className="font-medium text-foreground">{ins.startDate} &rarr; {ins.endDate}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null
        })()}

        {/* As-Built Documents */}
        <Card>
          <CardHeader><div className="flex items-center justify-between"><CardTitle className="flex items-center gap-2"><FolderArchive className="size-5" />Documenten (As-Built)</CardTitle><Button size="sm" variant="outline"><Upload className="size-4 mr-2" /> Document Uploaden</Button></div></CardHeader>
          <CardContent>
            {propertyDocs.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {propertyDocs.map((doc) => {
                  const dt = docTypeIcon[doc.type] || { icon: FileText, color: "text-muted-foreground bg-muted" }
                  const DocIcon = dt.icon
                  return (
                  <div key={doc.id} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className={`flex size-9 items-center justify-center rounded-lg shrink-0 ${dt.color}`}><DocIcon className="size-4" /></div>
                    <div className="min-w-0 flex-1"><p className="text-sm font-medium truncate">{doc.name}</p><p className="text-xs text-muted-foreground">{doc.category} &middot; {doc.size} &middot; {doc.uploadedAt}</p></div>
                  </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground"><FolderArchive className="size-10 mx-auto mb-2 opacity-30" /><p className="text-sm">Geen documenten beschikbaar voor dit pand</p></div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── Property cards list view ───────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Panden</h2>
        <p className="text-muted-foreground">Beheer uw pandenportefeuille</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Zoek panden..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Filter status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Status</SelectItem>
            <SelectItem value="occupied">Verhuurd</SelectItem>
            <SelectItem value="available">Beschikbaar</SelectItem>
            <SelectItem value="maintenance">Onderhoud</SelectItem>
            <SelectItem value="new">Nieuw</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => setAddOpen(true)}>+ Pand Toevoegen</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((property) => {
          const TypeIcon = typeIcons[property.type] || Building2
          const status = statusColors[property.status]
          const hasUploadedImage = !!propertyImages[property.id]
          const imageUrl = hasUploadedImage ? propertyImages[property.id] : property.image
          const leaseExpiring = isLeaseExpiringSoon(property.leaseEnd)

          return (
            <Card
              key={property.id}
              className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden"
              onClick={() => setSelectedProperty(property)}
            >
              <CardContent className="p-0">
                {/* Property Image */}
                <div className="relative h-36 overflow-hidden bg-muted">
                  <img
                    src={imageUrl}
                    alt={property.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <Badge variant="outline" className={`text-[11px] backdrop-blur-sm bg-white/90 dark:bg-black/70 border ${status.badge}`}>
                      <div className={`size-1.5 rounded-full ${status.dot} mr-1.5`} />
                      {statusLabels[property.status]}
                    </Badge>
                  </div>
                  <button
                    className="absolute top-2.5 right-2.5 flex items-center justify-center size-8 rounded-full bg-black/40 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-black/60"
                    onClick={(e) => { e.stopPropagation(); handlePropertyImage(property.id) }}
                  >
                    <Camera className="size-3.5" />
                  </button>
                  <div className="absolute bottom-2.5 right-2.5">
                    <div className="text-sm font-bold backdrop-blur-sm bg-white/90 dark:bg-black/70 rounded-md px-2 py-0.5">&euro;{property.monthlyRent.toLocaleString()}/mnd</div>
                  </div>
                  {/* Contract expiration warning on card image */}
                  {leaseExpiring && property.leaseEnd && (
                    <div className="absolute bottom-2.5 left-2.5">
                      <Badge className="bg-red-600 text-white text-[10px] border-0 shadow-sm">
                        <AlertTriangle className="size-3 mr-1" />
                        Contract verloopt {new Date(property.leaseEnd).toLocaleDateString("nl-BE", { day: "numeric", month: "short", year: "numeric" })}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className={`px-4 py-2.5 ${status.titleBg}`}>
                  <h3 className="font-semibold text-[15px] group-hover:text-primary transition-colors leading-tight">{property.name}</h3>
                  <div className="flex items-center gap-1 mt-0.5 text-sm text-muted-foreground">
                    <MapPin className="size-3 shrink-0" />
                    <span className="truncate">{property.address}, {property.city}</span>
                  </div>
                </div>
                <div className="px-4 pt-3 pb-4">
                  <Separator className="mb-3" />

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span className="flex items-center gap-1"><Bed className="size-3.5" /> {property.bedrooms}</span>
                      <span className="flex items-center gap-1"><Bath className="size-3.5" /> {property.bathrooms}</span>
                      <span className="flex items-center gap-1"><Ruler className="size-3.5" /> {property.sqm}m&sup2;</span>
                    </div>
                  </div>

                  {/* Tenant info on card */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    {property.tenant ? (
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <Avatar size="sm">
                          <AvatarImage src={property.tenant.photoUrl} alt={property.tenant.name} />
                          <AvatarFallback className="text-[10px]">{getInitials(property.tenant.name)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{property.tenant.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="size-2.5" />{property.tenant.phone}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground italic">Beschikbaar</span>
                    )}
                    <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Add property dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nieuw Pand Toevoegen</DialogTitle>
            <DialogDescription>Vul de gegevens in van het nieuwe pand</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Foto</label>
              <div
                className="flex items-center justify-center h-32 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/30 cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                onClick={() => {
                  const input = document.createElement("input")
                  input.type = "file"
                  input.accept = "image/*"
                  input.onchange = () => {}
                  input.click()
                }}
              >
                <div className="text-center">
                  <Camera className="size-8 mx-auto text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground mt-1">Klik om een foto te uploaden</p>
                </div>
              </div>
            </div>
            <div className="grid gap-2"><label className="text-sm font-medium">Pandnaam</label><Input placeholder="Bijv. Appartement Grote Markt" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><label className="text-sm font-medium">Adres</label><Input placeholder="Straat + nummer" /></div>
              <div className="grid gap-2"><label className="text-sm font-medium">Stad</label><Input placeholder="Bijv. Brussel" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><label className="text-sm font-medium">Postcode</label><Input placeholder="Bijv. 1000" /></div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Type</label>
                <Select defaultValue="apartment"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="apartment">Appartement</SelectItem><SelectItem value="house">Huis</SelectItem><SelectItem value="studio">Studio</SelectItem><SelectItem value="commercial">Commercieel</SelectItem></SelectContent></Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2"><label className="text-sm font-medium">Slaapkamers</label><Input type="number" placeholder="0" /></div>
              <div className="grid gap-2"><label className="text-sm font-medium">Badkamers</label><Input type="number" placeholder="0" /></div>
              <div className="grid gap-2"><label className="text-sm font-medium">Oppervlakte (m2)</label><Input type="number" placeholder="0" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><label className="text-sm font-medium">Bouwjaar</label><Input type="number" placeholder="Bijv. 2000" /></div>
              <div className="grid gap-2"><label className="text-sm font-medium">EPC-score</label><Input placeholder="Bijv. B" /></div>
            </div>
            <div className="grid gap-2"><label className="text-sm font-medium">Maandelijkse huurprijs (&euro;)</label><Input type="number" placeholder="0" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Annuleren</Button>
            <Button onClick={() => { setAddOpen(false); alert("Pand toegevoegd! (demo)") }}>Pand Toevoegen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
