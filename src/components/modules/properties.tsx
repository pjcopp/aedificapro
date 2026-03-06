"use client"

import { useState } from "react"
import { Search, Building2, Bed, Bath, Ruler, Home, Store, FolderArchive, FileText, Upload, Shield, ChevronRight, ClipboardCheck, Camera, Clock, AlertTriangle, CheckCircle2, AlertCircle, XCircle, Plus, ChevronDown, ChevronUp, Eye, X, ImageIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { properties, asBuiltDocuments, insurancePolicies, propertyInspections } from "@/lib/mock-data"
import type { Property, PropertyInspection, InspectionItem } from "@/lib/mock-data"
import { ContractView } from "./contracts"

const statusLabels: Record<string, string> = {
  occupied: "Verhuurd",
  available: "Beschikbaar",
  maintenance: "Onderhoud",
  new: "Nieuw",
}

const statusBarColors: Record<string, string> = {
  occupied: "bg-emerald-50 dark:bg-emerald-950/30",
  available: "bg-blue-50 dark:bg-blue-950/30",
  maintenance: "bg-amber-50 dark:bg-amber-950/30",
  new: "bg-purple-50 dark:bg-purple-950/30",
}

const statusDotColors: Record<string, string> = {
  occupied: "bg-emerald-500",
  available: "bg-blue-500",
  maintenance: "bg-amber-500",
  new: "bg-purple-500",
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

// ── Inspection Detail Component ────────────────────────────────────────────
function InspectionDetail({ inspection, onBack, inspectionPhotos, onUploadPhoto }: {
  inspection: PropertyInspection
  onBack: () => void
  inspectionPhotos: Record<string, string[]>
  onUploadPhoto: (itemId: string, url: string) => void
}) {
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null)
  const [photoViewItem, setPhotoViewItem] = useState<InspectionItem | null>(null)

  // Group items by room
  const rooms = inspection.items.reduce((acc, item) => {
    if (!acc[item.room]) acc[item.room] = []
    acc[item.room].push(item)
    return acc
  }, {} as Record<string, InspectionItem[]>)

  const totalItems = inspection.items.length
  const goodItems = inspection.items.filter((i) => i.condition === "goed").length
  const defectItems = totalItems - goodItems

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>&larr; Terug</Button>
        <div>
          <h3 className="text-lg font-bold">Plaatsbeschrijving - {inspectionTypeLabels[inspection.type]}</h3>
          <p className="text-sm text-muted-foreground">
            {new Date(inspection.date).toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric" })} - Inspecteur: {inspection.inspector}
          </p>
        </div>
        <Badge variant={inspection.status === "voltooid" ? "default" : "secondary"} className="ml-auto">
          {inspection.status === "voltooid" ? "Voltooid" : "In behandeling"}
        </Badge>
      </div>

      {/* Summary cards */}
      <div className="grid gap-3 grid-cols-3">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold">{totalItems}</p>
            <p className="text-xs text-muted-foreground">Totaal items</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{goodItems}</p>
            <p className="text-xs text-muted-foreground">In orde</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-orange-600">{defectItems}</p>
            <p className="text-xs text-muted-foreground">Gebreken</p>
          </CardContent>
        </Card>
      </div>

      {/* Room-based checklist */}
      <div className="space-y-2">
        {Object.entries(rooms).map(([room, items]) => {
          const isExpanded = expandedRoom === room
          const roomDefects = items.filter((i) => i.condition !== "goed").length

          return (
            <Card key={room}>
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedRoom(isExpanded ? null : room)}
              >
                <div className="flex items-center gap-3">
                  <Home className="size-4 text-muted-foreground" />
                  <span className="font-medium">{room}</span>
                  <Badge variant="outline" className="text-xs">{items.length} items</Badge>
                  {roomDefects > 0 && (
                    <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-600 border-orange-500/30">
                      {roomDefects} {roomDefects === 1 ? "gebrek" : "gebreken"}
                    </Badge>
                  )}
                </div>
                {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </div>
              {isExpanded && (
                <CardContent className="pt-0 pb-4">
                  <Separator className="mb-3" />
                  <div className="space-y-3">
                    {items.map((item) => {
                      const config = conditionConfig[item.condition]
                      const CondIcon = config.icon
                      const photos = inspectionPhotos[item.id] || []
                      const totalPhotos = item.photoCount + photos.length

                      return (
                        <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg border">
                          <CondIcon className={`size-5 mt-0.5 shrink-0 ${item.condition === "goed" ? "text-green-500" : item.condition === "licht gebrek" ? "text-yellow-500" : item.condition === "gebrek" ? "text-orange-500" : "text-red-500"}`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{item.element}</span>
                              <Badge variant="outline" className={`text-[10px] ${config.color}`}>{config.label}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="size-3" />
                                {new Date(item.timestamp).toLocaleTimeString("nl-BE", { hour: "2-digit", minute: "2-digit" })}
                              </span>
                              <button
                                className="text-xs flex items-center gap-1 text-primary hover:underline"
                                onClick={() => setPhotoViewItem(item)}
                              >
                                <Camera className="size-3" />
                                {totalPhotos} foto{totalPhotos !== 1 ? "s" : ""}
                              </button>
                            </div>
                          </div>
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

      {/* Photo Viewer Dialog */}
      <Dialog open={!!photoViewItem} onOpenChange={() => setPhotoViewItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="size-5" />
              Foto&#39;s - {photoViewItem?.room} / {photoViewItem?.element}
            </DialogTitle>
            <DialogDescription>
              {photoViewItem && (
                <Badge variant="outline" className={conditionConfig[photoViewItem.condition].color}>
                  {conditionConfig[photoViewItem.condition].label}
                </Badge>
              )}
            </DialogDescription>
          </DialogHeader>
          {photoViewItem && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{photoViewItem.description}</p>

              {/* Uploaded photos */}
              {(inspectionPhotos[photoViewItem.id]?.length > 0) && (
                <div className="grid gap-3 grid-cols-2">
                  {inspectionPhotos[photoViewItem.id].map((url, idx) => (
                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border">
                      <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Placeholder for demo photos */}
              {(!inspectionPhotos[photoViewItem.id] || inspectionPhotos[photoViewItem.id].length === 0) && (
                <div className="grid gap-3 grid-cols-2">
                  {Array.from({ length: photoViewItem.photoCount }).map((_, idx) => (
                    <div key={idx} className="flex flex-col items-center justify-center aspect-video rounded-lg border-2 border-dashed border-muted-foreground/20 bg-muted/30">
                      <ImageIcon className="size-8 text-muted-foreground/30 mb-2" />
                      <span className="text-xs text-muted-foreground">Foto {idx + 1}</span>
                      <span className="text-[10px] text-muted-foreground">(demo placeholder)</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const input = document.createElement("input")
                  input.type = "file"
                  input.accept = "image/*"
                  input.multiple = true
                  input.onchange = (ev) => {
                    const files = (ev.target as HTMLInputElement).files
                    if (files && photoViewItem) {
                      Array.from(files).forEach((file) => {
                        onUploadPhoto(photoViewItem.id, URL.createObjectURL(file))
                      })
                    }
                  }
                  input.click()
                }}
              >
                <Upload className="size-4 mr-2" /> Foto&#39;s Toevoegen
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ── Main Module ────────────────────────────────────────────────────────────
export function PropertiesModule() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showContract, setShowContract] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [selectedInspection, setSelectedInspection] = useState<PropertyInspection | null>(null)
  const [inspectionPhotos, setInspectionPhotos] = useState<Record<string, string[]>>({})

  const handleUploadPhoto = (itemId: string, url: string) => {
    setInspectionPhotos((prev) => ({
      ...prev,
      [itemId]: [...(prev[itemId] || []), url],
    }))
  }

  const filtered = properties.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (selectedProperty && showContract && selectedProperty.tenant) {
    return (
      <ContractView
        property={selectedProperty}
        onBack={() => setShowContract(false)}
        backLabel="Terug naar Pandgegevens"
      />
    )
  }

  if (selectedProperty && selectedInspection) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => setSelectedInspection(null)}>
          &larr; Terug naar Pandgegevens
        </Button>
        <InspectionDetail
          inspection={selectedInspection}
          onBack={() => setSelectedInspection(null)}
          inspectionPhotos={inspectionPhotos}
          onUploadPhoto={handleUploadPhoto}
        />
      </div>
    )
  }

  if (selectedProperty) {
    const propertyDocs = asBuiltDocuments.filter((d) => d.propertyId === selectedProperty.id)
    const propInspections = propertyInspections.filter((i) => i.propertyId === selectedProperty.id)

    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => { setSelectedProperty(null); setShowContract(false) }}>
          &larr; Terug naar Panden
        </Button>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{selectedProperty.name}</h2>
            <p className="text-muted-foreground">
              {selectedProperty.address}, {selectedProperty.zipCode} {selectedProperty.city}
            </p>
          </div>
          <Badge variant="secondary">{statusLabels[selectedProperty.status]}</Badge>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Maandelijkse Huur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">&euro;{selectedProperty.monthlyRent.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Jaarlijkse Inkomsten</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                &euro;{(selectedProperty.monthlyRent * 12).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Totale Inkomsten</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                &euro;{selectedProperty.totalRevenue.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Property Details + Tenant */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Pandgegevens</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">{typeLabels[selectedProperty.type]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Oppervlakte</span>
                <span className="font-medium">{selectedProperty.sqm} m&sup2;</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Slaapkamers</span>
                <span className="font-medium">{selectedProperty.bedrooms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Badkamers</span>
                <span className="font-medium">{selectedProperty.bathrooms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Prijs per m&sup2;</span>
                <span className="font-medium">
                  &euro;{(selectedProperty.monthlyRent / selectedProperty.sqm).toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Huurder Informatie</CardTitle></CardHeader>
            <CardContent>
              {selectedProperty.tenant ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Naam</span>
                    <span className="font-medium">{selectedProperty.tenant.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">E-mail</span>
                    <span className="font-medium">{selectedProperty.tenant.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Telefoon</span>
                    <span className="font-medium">{selectedProperty.tenant.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Huurstart</span>
                    <span className="font-medium">{selectedProperty.leaseStart}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Huurende</span>
                    <span className="font-medium">{selectedProperty.leaseEnd}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Building2 className="size-10 mb-2 opacity-50" />
                  <p>Geen actieve huurder</p>
                  <Button size="sm" className="mt-3">Te Huur Zetten</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Utilities */}
        {selectedProperty.utilities.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Maandelijkse Nutsvoorzieningen</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {selectedProperty.utilities.map((u) => (
                  <div key={u.name} className="flex items-center justify-between rounded-lg border p-3">
                    <span className="text-sm text-muted-foreground">{u.name}</span>
                    <span className="font-medium">&euro;{u.monthlyCost}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between border-t pt-3">
                <span className="font-medium">Totaal Nutsvoorzieningen</span>
                <span className="font-bold">
                  &euro;{selectedProperty.utilities.reduce((s, u) => s + u.monthlyCost, 0)}/maand
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plaatsbeschrijvingen */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="size-5" />
                Plaatsbeschrijvingen
              </CardTitle>
              <Button size="sm" variant="outline">
                <Plus className="size-4 mr-2" /> Nieuwe Inspectie
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {propInspections.length > 0 ? (
              <div className="space-y-3">
                {propInspections.map((insp) => {
                  const defects = insp.items.filter((i) => i.condition !== "goed").length
                  const critical = insp.items.filter((i) => i.condition === "ernstig gebrek").length

                  return (
                    <div
                      key={insp.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedInspection(insp)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex size-10 items-center justify-center rounded-lg ${insp.type === "intrede" ? "bg-blue-500/10" : insp.type === "uittrede" ? "bg-orange-500/10" : "bg-purple-500/10"}`}>
                          <ClipboardCheck className={`size-5 ${insp.type === "intrede" ? "text-blue-500" : insp.type === "uittrede" ? "text-orange-500" : "text-purple-500"}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{inspectionTypeLabels[insp.type]} plaatsbeschrijving</p>
                            <Badge variant={insp.status === "voltooid" ? "default" : "secondary"} className="text-[10px]">
                              {insp.status === "voltooid" ? "Voltooid" : "In behandeling"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(insp.date).toLocaleDateString("nl-BE", { day: "numeric", month: "long", year: "numeric" })} - {insp.inspector}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right text-sm">
                          <p>{insp.items.length} items gecontroleerd</p>
                          <div className="flex items-center gap-2 justify-end">
                            {defects > 0 && (
                              <span className="text-orange-600 text-xs">{defects} {defects === 1 ? "gebrek" : "gebreken"}</span>
                            )}
                            {critical > 0 && (
                              <span className="text-red-600 text-xs font-medium">{critical} ernstig</span>
                            )}
                            {defects === 0 && (
                              <span className="text-green-600 text-xs">Alles in orde</span>
                            )}
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
                <ClipboardCheck className="size-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Nog geen plaatsbeschrijvingen voor dit pand</p>
                <Button size="sm" variant="outline" className="mt-3">
                  <Plus className="size-4 mr-2" /> Eerste Inspectie Aanmaken
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contract */}
        {selectedProperty.tenant && selectedProperty.leaseStart && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="size-5" />
                  Huurcontract
                </CardTitle>
                <Button size="sm" onClick={() => setShowContract(true)}>Bekijk Contract</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm text-muted-foreground">Referentie</span>
                  <span className="font-medium text-sm">AEP-{selectedProperty.id.toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm text-muted-foreground">Periode</span>
                  <span className="font-medium text-sm">{selectedProperty.leaseStart} &rarr; {selectedProperty.leaseEnd}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm text-muted-foreground">Huurprijs</span>
                  <span className="font-medium text-sm">&euro;{selectedProperty.monthlyRent.toLocaleString()}/mnd</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm text-muted-foreground">Huurder</span>
                  <span className="font-medium text-sm">{selectedProperty.tenant.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Verzekeringen */}
        {(() => {
          const propInsurance = insurancePolicies.filter((i) => i.propertyId === selectedProperty.id)
          return propInsurance.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="size-5" />
                  Verzekeringen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {propInsurance.map((ins) => (
                    <div key={ins.id} className="rounded-lg border p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{ins.type}</span>
                        <Badge variant="secondary" className="text-xs">{ins.holder === "owner" ? "Eigenaar" : "Huurder"}</Badge>
                      </div>
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
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FolderArchive className="size-5" />
                Documenten (As-Built)
              </CardTitle>
              <Button size="sm" variant="outline">
                <Upload className="size-4 mr-2" /> Document Uploaden
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {propertyDocs.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {propertyDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <FileText className="size-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.category} &middot; {doc.size} &middot; {doc.uploadedAt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FolderArchive className="size-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Geen documenten beschikbaar voor dit pand</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

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
          return (
            <Card
              key={property.id}
              className={`group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden ${statusBarColors[property.status]}`}
              onClick={() => setSelectedProperty(property)}
            >
              <CardContent className="p-0">
                <div className="flex items-start justify-between p-4 pb-2">
                  <div>
                    <h3 className="font-bold group-hover:text-primary transition-colors">
                      {property.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {property.address}, {property.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <div className={`size-2 rounded-full ${statusDotColors[property.status]}`} />
                    <span className="text-xs font-medium">{statusLabels[property.status]}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center py-6">
                  <div className="flex size-20 items-center justify-center rounded-xl bg-muted/60">
                    <TypeIcon className="size-10 text-muted-foreground/60" />
                  </div>
                </div>
                <div className="space-y-0 border-t mx-4">
                  <div className="flex items-center justify-between py-2.5 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Huurprijs</span>
                    <span className="text-sm font-bold">&#x20AC;{property.monthlyRent.toLocaleString()}/mnd</span>
                  </div>
                  <div className="flex items-center justify-between py-2.5 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Type</span>
                    <span className="text-sm font-semibold">{typeLabels[property.type]}</span>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-sm text-muted-foreground">Huurder</span>
                    <span className="text-sm font-semibold">{property.tenant ? property.tenant.name : "Geen"}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3 mt-1 border-t text-sm text-muted-foreground group-hover:text-primary transition-colors">
                  <span>Bekijk details</span>
                  <ChevronRight className="size-4" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Pand Toevoegen Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nieuw Pand Toevoegen</DialogTitle>
            <DialogDescription>Vul de gegevens in van het nieuwe pand</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Pandnaam</label>
              <Input placeholder="Bijv. Appartement Grote Markt" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Adres</label>
                <Input placeholder="Straat + nummer" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Stad</label>
                <Input placeholder="Bijv. Brussel" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Postcode</label>
                <Input placeholder="Bijv. 1000" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Type</label>
                <Select defaultValue="apartment">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Appartement</SelectItem>
                    <SelectItem value="house">Huis</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="commercial">Commercieel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Slaapkamers</label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Badkamers</label>
                <Input type="number" placeholder="0" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Oppervlakte (m2)</label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Maandelijkse huurprijs (&#x20AC;)</label>
              <Input type="number" placeholder="0" />
            </div>
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
