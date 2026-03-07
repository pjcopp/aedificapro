"use client"

import { useState } from "react"
import { candidateTenants, properties } from "@/lib/mock-data"
import type { CandidateTenant } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  UserPlus,
  Mail,
  Phone,
  ArrowLeft,
  Search,
  Users,
  Euro,
  PawPrint,
  StickyNote,
  Calendar,
  Home,
  CheckCircle2,
  XCircle,
  Clock,
  Camera,
} from "lucide-react"

const statusConfig: Record<CandidateTenant["status"], { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof CheckCircle2 }> = {
  pending: { label: "In behandeling", variant: "outline", icon: Clock },
  approved: { label: "Goedgekeurd", variant: "default", icon: CheckCircle2 },
  rejected: { label: "Afgewezen", variant: "destructive", icon: XCircle },
}

function CandidateDetail({ candidate, onBack, photo, onPhotoChange }: { candidate: CandidateTenant; onBack: () => void; photo: string | null; onPhotoChange: (url: string) => void }) {
  const property = properties.find((p) => p.id === candidate.appliedForId)
  const status = statusConfig[candidate.status]
  const StatusIcon = status.icon
  const displayPhoto = photo || candidate.photoUrl

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="relative group">
          <Avatar className="size-12">
            <AvatarImage src={displayPhoto} alt={candidate.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">{candidate.avatar}</AvatarFallback>
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
          <h2 className="text-2xl font-bold">{candidate.name}</h2>
        </div>
        <Badge variant={status.variant}>
          <StatusIcon className="mr-1 h-3 w-3" />
          {status.label}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Contactgegevens</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{candidate.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{candidate.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Aangevraagd: {new Date(candidate.appliedAt).toLocaleDateString("nl-BE")}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Profiel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{candidate.familySituation}</span>
            </div>
            <div className="flex items-center gap-3">
              <Euro className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Inkomen: &#x20AC;{candidate.monthlyIncome.toLocaleString("nl-BE")}/maand</span>
            </div>
            {candidate.pets && (
              <div className="flex items-center gap-3">
                <PawPrint className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{candidate.pets}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {property && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Solliciteert voor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Home className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{property.name}</p>
                <p className="text-sm text-muted-foreground">{property.address}, {property.zipCode} {property.city} - &#x20AC;{property.monthlyRent}/maand</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {candidate.notes && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <StickyNote className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notities</p>
                <p className="text-sm">{candidate.notes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export function CandidatesModule() {
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateTenant | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [candidatePhotos, setCandidatePhotos] = useState<Record<string, string>>({})

  if (selectedCandidate) {
    return (
      <CandidateDetail
        candidate={selectedCandidate}
        onBack={() => setSelectedCandidate(null)}
        photo={candidatePhotos[selectedCandidate.id] || selectedCandidate.photoUrl}
        onPhotoChange={(url) => setCandidatePhotos(prev => ({ ...prev, [selectedCandidate.id]: url }))}
      />
    )
  }

  const filtered = candidateTenants
    .filter((c) => statusFilter === "all" || c.status === statusFilter)
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Kandidaat Huurders</h2>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {[
              { value: "all", label: "Alle" },
              { value: "pending", label: "In behandeling" },
              { value: "approved", label: "Goedgekeurd" },
              { value: "rejected", label: "Afgewezen" },
            ].map((opt) => (
              <Button
                key={opt.value}
                variant={statusFilter === opt.value ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Zoek kandidaat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((candidate) => {
          const property = properties.find((p) => p.id === candidate.appliedForId)
          const status = statusConfig[candidate.status]
          const StatusIcon = status.icon
          const displayPhoto = candidatePhotos[candidate.id] || candidate.photoUrl

          return (
            <Card
              key={candidate.id}
              className="cursor-pointer transition-shadow hover:shadow-lg"
              onClick={() => setSelectedCandidate(candidate)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      <Avatar className="size-10">
                        <AvatarImage src={displayPhoto} alt={candidate.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">{candidate.avatar}</AvatarFallback>
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
                            if (file) setCandidatePhotos(prev => ({ ...prev, [candidate.id]: URL.createObjectURL(file) }))
                          }
                          input.click()
                        }}
                      >
                        <Camera className="size-3 text-white" />
                      </button>
                    </div>
                    <div>
                      <CardTitle className="text-base">{candidate.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{candidate.familySituation}</p>
                    </div>
                  </div>
                  <Badge variant={status.variant}>
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {status.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {property && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Home className="h-3.5 w-3.5" />
                      <span>{property.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Euro className="h-3.5 w-3.5" />
                    <span>Inkomen: &#x20AC;{candidate.monthlyIncome.toLocaleString("nl-BE")}/m</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(candidate.appliedAt).toLocaleDateString("nl-BE")}</span>
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
