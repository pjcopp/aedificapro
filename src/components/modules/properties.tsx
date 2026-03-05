"use client"

import { useState } from "react"
import { Search, Building2, Bed, Bath, Ruler, Home, Store, FolderArchive, FileText, Upload } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { properties, asBuiltDocuments } from "@/lib/mock-data"
import type { Property } from "@/lib/mock-data"
import { ContractView } from "./contracts"

const statusLabels: Record<string, string> = {
  occupied: "Verhuurd",
  available: "Beschikbaar",
  maintenance: "Onderhoud",
}

const statusBarColors: Record<string, string> = {
  occupied: "bg-emerald-200 dark:bg-emerald-900/40",
  available: "bg-blue-200 dark:bg-blue-900/40",
  maintenance: "bg-amber-200 dark:bg-amber-900/40",
}

const typeLabels: Record<string, string> = {
  apartment: "Appartement",
  house: "Huis",
  studio: "Studio",
  commercial: "Commercieel",
}

export function PropertiesModule() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showContract, setShowContract] = useState(false)

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

  if (selectedProperty) {
    const propertyDocs = asBuiltDocuments.filter((d) => d.propertyId === selectedProperty.id)

    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => { setSelectedProperty(null); setShowContract(false) }}>
          &larr; Terug naar Vastgoed
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
        <h2 className="text-2xl font-bold tracking-tight">Vastgoed</h2>
        <p className="text-muted-foreground">Beheer uw vastgoedportefeuille</p>
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
          </SelectContent>
        </Select>
        <Button>+ Pand Toevoegen</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((property) => (
          <Card
            key={property.id}
            className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 hover:border-foreground/20 overflow-hidden"
            onClick={() => setSelectedProperty(property)}
          >
            <div className={`h-1 ${statusBarColors[property.status]}`} />
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {property.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {property.address}, {property.city}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs shrink-0">
                  {statusLabels[property.status]}
                </Badge>
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Bed className="size-3.5" /> {property.bedrooms}</span>
                <span className="flex items-center gap-1"><Bath className="size-3.5" /> {property.bathrooms}</span>
                <span className="flex items-center gap-1"><Ruler className="size-3.5" /> {property.sqm}m&sup2;</span>
              </div>
              <div className="flex items-center justify-between border-t pt-3">
                <div>
                  <p className="text-lg font-bold">
                    &euro;{property.monthlyRent.toLocaleString()}
                    <span className="text-sm font-normal text-muted-foreground">/mnd</span>
                  </p>
                </div>
                <div className="text-right">
                  {property.tenant ? (
                    <p className="text-sm text-muted-foreground">{property.tenant.name}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Geen huurder</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
