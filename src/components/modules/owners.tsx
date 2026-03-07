"use client"

import { useState } from "react"
import { owners, properties } from "@/lib/mock-data"
import type { Owner } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Building2,
  Mail,
  Phone,
  ArrowLeft,
  Search,
  Briefcase,
  Euro,
  Wrench,
  StickyNote,
  Camera,
} from "lucide-react"

function OwnerDetail({ owner, onBack, photo, onPhotoChange }: { owner: Owner; onBack: () => void; photo: string | null; onPhotoChange: (url: string) => void }) {
  const ownerProperties = properties.filter((p) => owner.propertyIds.includes(p.id))
  const totalRent = ownerProperties.reduce((sum, p) => sum + p.monthlyRent, 0)
  const displayPhoto = photo || owner.photoUrl

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="relative group">
          <Avatar className="size-12">
            <AvatarImage src={displayPhoto} alt={owner.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">{owner.avatar}</AvatarFallback>
          </Avatar>
          <button
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              const input = document.createElement("input")
              input.type = "file"
              input.accept = "image/*"
              input.onchange = (ev) => {
                const file = (ev.target as HTMLInputElement).files?.[0]
                if (file) onPhotoChange(URL.createObjectURL(file))
              }
              input.click()
            }}
          >
            <Camera className="size-4 text-white" />
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-bold">{owner.name}</h2>
          {owner.company && (
            <Badge variant="outline">{owner.company}</Badge>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{owner.email}</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{owner.phone}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Euro className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Beheersvergoeding</p>
                <p className="text-lg font-semibold">{owner.managementFeePercent}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Wrench className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Herstellingsmandaat</p>
                <p className="text-lg font-semibold">&#x20AC;{owner.repairMandate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {owner.notes && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <StickyNote className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notities</p>
                <p className="text-sm">{owner.notes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      <div>
        <h3 className="mb-4 text-lg font-semibold">
          Panden ({ownerProperties.length}) - Totale huur: &#x20AC;{totalRent.toLocaleString("nl-BE")}/maand
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ownerProperties.map((p) => (
            <Card key={p.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {p.address}, {p.zipCode} {p.city}
                    </p>
                  </div>
                  <Badge
                    variant={
                      p.status === "occupied"
                        ? "default"
                        : p.status === "available"
                          ? "secondary"
                          : p.status === "new"
                            ? "outline"
                            : "destructive"
                    }
                  >
                    {p.status === "occupied"
                      ? "Verhuurd"
                      : p.status === "available"
                        ? "Beschikbaar"
                        : p.status === "new"
                          ? "Nieuw"
                          : "Onderhoud"}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {p.type === "apartment" ? "Appartement" : p.type === "house" ? "Woning" : p.type === "studio" ? "Studio" : "Commercieel"} - {p.sqm}m2
                  </span>
                  <span className="font-semibold">&#x20AC;{p.monthlyRent}/m</span>
                </div>
                {p.tenant && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    Huurder: {p.tenant.name}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export function OwnersModule() {
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null)
  const [search, setSearch] = useState("")
  const [ownerPhotos, setOwnerPhotos] = useState<Record<string, string>>({})

  if (selectedOwner) {
    return (
      <OwnerDetail
        owner={selectedOwner}
        onBack={() => setSelectedOwner(null)}
        photo={ownerPhotos[selectedOwner.id] || selectedOwner.photoUrl}
        onPhotoChange={(url) => setOwnerPhotos(prev => ({ ...prev, [selectedOwner.id]: url }))}
      />
    )
  }

  const filtered = owners.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      (o.company && o.company.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Verhuurders</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Zoek verhuurder..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((owner) => {
          const ownerProps = properties.filter((p) => owner.propertyIds.includes(p.id))
          const totalRent = ownerProps.reduce((sum, p) => sum + p.monthlyRent, 0)
          const displayPhoto = ownerPhotos[owner.id] || owner.photoUrl

          return (
            <Card
              key={owner.id}
              className="cursor-pointer transition-shadow hover:shadow-lg"
              onClick={() => setSelectedOwner(owner)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      <Avatar className="size-10">
                        <AvatarImage src={displayPhoto} alt={owner.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">{owner.avatar}</AvatarFallback>
                      </Avatar>
                      <button
                        className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          const input = document.createElement("input")
                          input.type = "file"
                          input.accept = "image/*"
                          input.onchange = (ev) => {
                            const file = (ev.target as HTMLInputElement).files?.[0]
                            if (file) setOwnerPhotos(prev => ({ ...prev, [owner.id]: URL.createObjectURL(file) }))
                          }
                          input.click()
                        }}
                      >
                        <Camera className="size-3 text-white" />
                      </button>
                    </div>
                    <div>
                      <CardTitle className="text-base">{owner.name}</CardTitle>
                      {owner.company && (
                        <p className="text-sm text-muted-foreground">{owner.company}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>{ownerProps.length} panden</span>
                    <span className="ml-auto font-medium text-foreground">
                      &#x20AC;{totalRent.toLocaleString("nl-BE")}/m
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Euro className="h-3.5 w-3.5" />
                    <span>Vergoeding: {owner.managementFeePercent}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Wrench className="h-3.5 w-3.5" />
                    <span>Mandaat: &#x20AC;{owner.repairMandate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
