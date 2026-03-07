"use client"

import { useState, useRef } from "react"
import { Search, Phone, Mail, Calendar, Plus, ArrowLeft, Upload, FileText, Trash2, Camera, User, Home, ChevronRight, File } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { tenants, properties, paymentHistory } from "@/lib/mock-data"
import type { Tenant } from "@/lib/mock-data"

type TenantDoc = {
  id: string
  name: string
  size: string
  uploadedAt: string
}

type TenantWithExtra = Tenant & {
  propertyName?: string
  photoUrl?: string | null
  documents?: TenantDoc[]
}

function TenantDetail({ tenant, onBack, onPhotoChange }: {
  tenant: TenantWithExtra
  onBack: () => void
  onPhotoChange: (url: string) => void
}) {
  const [documents, setDocuments] = useState<TenantDoc[]>(tenant.documents || [])
  const photoInputRef = useRef<HTMLInputElement>(null)
  const docInputRef = useRef<HTMLInputElement>(null)

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const newDoc: TenantDoc = {
        id: "doc-" + Date.now(),
        name: file.name,
        size: (file.size / 1024).toFixed(0) + " KB",
        uploadedAt: new Date().toLocaleDateString("nl-BE"),
      }
      setDocuments((prev) => [newDoc, ...prev])
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      onPhotoChange(url)
    }
  }

  const history = paymentHistory[tenant.id]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold">Huurder Details</h2>
      </div>

      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <div className="relative group">
              <Avatar className="size-20 border-2 border-muted">
                {tenant.photoUrl ? (
                  <AvatarImage src={tenant.photoUrl} alt={tenant.name} />
                ) : null}
                <AvatarFallback className="bg-primary/10 text-primary text-xl">{tenant.avatar}</AvatarFallback>
              </Avatar>
              <button
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => photoInputRef.current?.click()}
              >
                <Camera className="size-5 text-white" />
              </button>
              <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{tenant.name}</h3>
              <div className="grid gap-2 mt-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="size-4" /> {tenant.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="size-4" /> {tenant.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Home className="size-4" /> {tenant.propertyName || tenant.address}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="size-4" /> Inhuisdatum: {tenant.moveInDate}
                </div>
              </div>
            </div>
            {history && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Betalingsscore</p>
                <p className={"text-3xl font-bold " + (history.score >= 90 ? "text-green-600" : history.score >= 80 ? "text-orange-600" : "text-red-600")}>
                  {history.score}%
                </p>
                <p className="text-xs text-muted-foreground">{history.onTime}x op tijd, {history.late}x laat</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documents Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5" />
              Documenten
            </CardTitle>
            <Button size="sm" variant="outline" onClick={() => docInputRef.current?.click()}>
              <Upload className="size-4 mr-2" /> Document Uploaden
            </Button>
            <input ref={docInputRef} type="file" className="hidden" onChange={handleDocUpload} />
          </div>
        </CardHeader>
        <CardContent>
          {documents.length > 0 ? (
            <div className="divide-y">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 py-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                    <File className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.size} - {doc.uploadedAt}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setDocuments(prev => prev.filter(d => d.id !== doc.id))} className="text-destructive hover:text-destructive">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="size-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Geen documenten. Upload identiteitsbewijs, huurcontract, etc.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function TenantsModule() {
  const [search, setSearch] = useState("")
  const [addOpen, setAddOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<TenantWithExtra | null>(null)
  const [tenantPhotos, setTenantPhotos] = useState<Record<string, string>>({})

  const tenantsWithProperty: TenantWithExtra[] = tenants.map((t) => ({
    ...t,
    propertyName: properties.find((p) => p.id === t.propertyId)?.name,
    photoUrl: tenantPhotos[t.id] || t.photoUrl,
    documents: [],
  }))

  const filtered = tenantsWithProperty.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.phone.includes(search)
  )

  if (selectedTenant) {
    return (
      <TenantDetail
        tenant={{ ...selectedTenant, photoUrl: tenantPhotos[selectedTenant.id] || selectedTenant.photoUrl }}
        onBack={() => setSelectedTenant(null)}
        onPhotoChange={(url) => setTenantPhotos(prev => ({ ...prev, [selectedTenant.id]: url }))}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Huurders</h2>
          <p className="text-muted-foreground">Overzicht van alle huidige huurders</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="size-4 mr-2" /> Nieuwe Huurder
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input placeholder="Zoek huurders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Huurder</TableHead>
                <TableHead>Pand</TableHead>
                <TableHead>Telefoon</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Inhuisdatum</TableHead>
                <TableHead>Betalingsscore</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((tenant) => (
                <TableRow key={tenant.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedTenant(tenant)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarImage src={tenantPhotos[tenant.id] || tenant.photoUrl} alt={tenant.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">{tenant.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{tenant.name}</p>
                        <p className="text-xs text-muted-foreground">{tenant.address}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="secondary">{tenant.propertyName}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm"><Phone className="size-3.5 text-muted-foreground" />{tenant.phone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm"><Mail className="size-3.5 text-muted-foreground" />{tenant.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm"><Calendar className="size-3.5 text-muted-foreground" />{tenant.moveInDate}</div>
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const history = paymentHistory[tenant.id]
                      if (!history) return <span className="text-xs text-muted-foreground">-</span>
                      const color = history.score >= 90 ? "text-green-600 bg-green-500/10" : history.score >= 80 ? "text-orange-600 bg-orange-500/10" : "text-red-600 bg-red-500/10"
                      return (
                        <div className="flex items-center gap-2">
                          <span className={"text-xs font-bold px-2 py-0.5 rounded-full " + color}>{history.score}%</span>
                          <span className="text-xs text-muted-foreground">{history.onTime}x op tijd</span>
                        </div>
                      )
                    })()}
                  </TableCell>
                  <TableCell>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Nieuwe Huurder Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nieuwe Huurder Toevoegen</DialogTitle>
            <DialogDescription>Vul de gegevens in van de nieuwe huurder</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Avatar className="size-16 border-2 border-dashed border-muted-foreground/30">
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    <User className="size-6" />
                  </AvatarFallback>
                </Avatar>
                <button
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => document.getElementById("new-tenant-photo")?.click()}
                >
                  <Camera className="size-4 text-white" />
                </button>
                <input id="new-tenant-photo" type="file" accept="image/*" className="hidden" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Profielfoto</p>
                <p className="text-xs text-muted-foreground">Klik op de avatar om een foto te uploaden</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Volledige naam</label>
                <Input placeholder="Bijv. Jan Peeters" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">E-mail</label>
                <Input type="email" placeholder="jan@email.be" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Telefoon</label>
                <Input placeholder="+32 470 00 00 00" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Adres</label>
                <Input placeholder="Huidig adres" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Toewijzen aan pand</label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Selecteer pand" /></SelectTrigger>
                  <SelectContent>
                    {properties.filter(p => !p.tenant).map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Inhuisdatum</label>
                <Input type="date" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Annuleren</Button>
            <Button onClick={() => { setAddOpen(false); alert("Huurder toegevoegd! (demo)") }}>
              Huurder Toevoegen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
