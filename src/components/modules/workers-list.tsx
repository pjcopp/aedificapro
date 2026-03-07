"use client"

import { useState, useMemo } from "react"
import { Phone, Mail, Star, CheckCircle2, XCircle, Camera, MapPin, Filter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { workers, specialtyLabels, regionList } from "@/lib/mock-data"

const specialtyColors: Record<string, string> = {
  electrician: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
  plumber: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  hvac: "bg-cyan-500/10 text-cyan-600 border-cyan-500/30",
  general: "bg-gray-500/10 text-gray-600 border-gray-500/30",
  painter: "bg-purple-500/10 text-purple-600 border-purple-500/30",
  locksmith: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  glazier: "bg-teal-500/10 text-teal-600 border-teal-500/30",
  drain_cleaner: "bg-indigo-500/10 text-indigo-600 border-indigo-500/30",
}

// Map ticket categories to worker specialties for auto-suggestion
const categoryToSpecialty: Record<string, string> = {
  plumbing: "plumber",
  electrical: "electrician",
  hvac: "hvac",
  structural: "general",
  appliance: "general",
  other: "general",
}

// Map cities to regions for auto-suggestion
const cityToRegion: Record<string, string> = {
  Brussel: "Brussel",
  Antwerpen: "Antwerpen",
  Gent: "Oost-Vlaanderen",
  Leuven: "Vlaams-Brabant",
  Brugge: "West-Vlaanderen",
  Luik: "Luik",
  Mechelen: "Antwerpen",
}

type TicketContext = {
  category: string
  propertyCity: string
}

interface WorkersModuleProps {
  ticketContext?: TicketContext
}

export function WorkersModule({ ticketContext }: WorkersModuleProps = {}) {
  const suggestedRegion = ticketContext ? (cityToRegion[ticketContext.propertyCity] || "") : ""
  const suggestedSpecialty = ticketContext ? (categoryToSpecialty[ticketContext.category] || "") : ""

  const [regionFilter, setRegionFilter] = useState<string>(suggestedRegion || "alle")
  const [specialtyFilter, setSpecialtyFilter] = useState<string>(suggestedSpecialty || "alle")
  const [workerPhotos, setWorkerPhotos] = useState<Record<string, string>>({})

  const filteredWorkers = useMemo(() => {
    return workers.filter((w) => {
      const matchRegion = regionFilter === "alle" || w.region === regionFilter
      const matchSpecialty = specialtyFilter === "alle" || w.specialty === specialtyFilter
      return matchRegion && matchSpecialty
    })
  }, [regionFilter, specialtyFilter])

  // Group workers by region
  const groupedWorkers = useMemo(() => {
    const groups: Record<string, typeof workers> = {}
    for (const w of filteredWorkers) {
      if (!groups[w.region]) groups[w.region] = []
      groups[w.region].push(w)
    }
    // Sort regions alphabetically
    const sorted: [string, typeof workers][] = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
    return sorted
  }, [filteredWorkers])

  // Unique specialties present in data
  const availableSpecialties = useMemo(() => {
    const set = new Set(workers.map((w) => w.specialty))
    return Array.from(set).sort()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Vaklui</h2>
          <p className="text-muted-foreground">Overzicht van onderhoudsprofessionals</p>
        </div>
        <Button>+ Vakman Toevoegen</Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Filteren:</span>
        </div>
        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Regio selecteren" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle regio&apos;s</SelectItem>
            {regionList.map((region) => (
              <SelectItem key={region} value={region}>{region}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Specialiteit selecteren" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="alle">Alle specialiteiten</SelectItem>
            {availableSpecialties.map((spec) => (
              <SelectItem key={spec} value={spec}>{specialtyLabels[spec] || spec}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(regionFilter !== "alle" || specialtyFilter !== "alle") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setRegionFilter("alle"); setSpecialtyFilter("alle") }}
          >
            Filters wissen
          </Button>
        )}
      </div>

      {/* Ticket context suggestion banner */}
      {ticketContext && (suggestedRegion || suggestedSpecialty) && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
          Aanbevolen vaklui op basis van ticket: <strong>{specialtyLabels[suggestedSpecialty] || "Allround"}</strong>
          {suggestedRegion && <> in regio <strong>{suggestedRegion}</strong></>}
        </div>
      )}

      {/* No results */}
      {filteredWorkers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          Geen vaklui gevonden voor de geselecteerde filters.
        </div>
      )}

      {/* Workers grouped by region */}
      {groupedWorkers.map(([region, regionWorkers]) => (
        <div key={region} className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold">{region}</h3>
            <Badge variant="secondary" className="text-xs">{regionWorkers.length}</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {regionWorkers.map((worker) => {
              const isSuggested = ticketContext && worker.specialty === suggestedSpecialty && worker.region === suggestedRegion

              return (
                <Card
                  key={worker.id}
                  className={`transition-all hover:shadow-md ${isSuggested ? "ring-2 ring-blue-400 dark:ring-blue-600" : ""}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="relative group">
                        <Avatar className="size-12">
                          {workerPhotos[worker.id] ? (
                            <AvatarImage src={workerPhotos[worker.id]} alt={worker.name} />
                          ) : worker.photoUrl ? (
                            <AvatarImage src={worker.photoUrl} alt={worker.name} />
                          ) : null}
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {worker.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
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
                              if (file) setWorkerPhotos((prev) => ({ ...prev, [worker.id]: URL.createObjectURL(file) }))
                            }
                            input.click()
                          }}
                        >
                          <Camera className="size-4 text-white" />
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{worker.name}</h4>
                          {worker.available ? (
                            <CheckCircle2 className="size-4 text-green-500" />
                          ) : (
                            <XCircle className="size-4 text-red-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge variant="outline" className={specialtyColors[worker.specialty]}>
                            {specialtyLabels[worker.specialty] || worker.specialty}
                          </Badge>
                          <div className="flex items-center gap-0.5">
                            <Star className="size-3.5 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium">{worker.rating}</span>
                          </div>
                          {isSuggested && (
                            <Badge className="bg-blue-100 text-blue-700 border-blue-300 text-xs dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700">
                              Aanbevolen
                            </Badge>
                          )}
                        </div>
                        <div className="mt-3 space-y-1.5">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="size-3.5" />
                            {worker.phone}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="size-3.5" />
                            <span className="truncate">{worker.email}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" className="flex-1">Bellen</Button>
                          <Button size="sm" className="flex-1">E-mailen</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
