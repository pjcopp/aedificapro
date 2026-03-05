"use client"

import { Phone, Mail, Star, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { workers } from "@/lib/mock-data"

const specialtyColors: Record<string, string> = {
  electrician: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
  plumber: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  hvac: "bg-cyan-500/10 text-cyan-600 border-cyan-500/30",
  general: "bg-gray-500/10 text-gray-600 border-gray-500/30",
  painter: "bg-purple-500/10 text-purple-600 border-purple-500/30",
  locksmith: "bg-orange-500/10 text-orange-600 border-orange-500/30",
}
const specialtyLabels: Record<string, string> = {
  electrician: "Elektricien", plumber: "Loodgieter", hvac: "HVAC", general: "Allround", painter: "Schilder", locksmith: "Slotenmaker",
}

export function WorkersModule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold tracking-tight">Vaklui</h2><p className="text-muted-foreground">Overzicht van onderhoudsprofessionals</p></div>
        <Button>+ Vakman Toevoegen</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workers.map((worker) => (
          <Card key={worker.id} className="transition-all hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <Avatar className="size-12"><AvatarFallback className="bg-primary/10 text-primary">{worker.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{worker.name}</h4>
                    {worker.available ? <CheckCircle2 className="size-4 text-green-500" /> : <XCircle className="size-4 text-red-500" />}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={specialtyColors[worker.specialty]}>{specialtyLabels[worker.specialty]}</Badge>
                    <div className="flex items-center gap-0.5"><Star className="size-3.5 text-yellow-500 fill-yellow-500" /><span className="text-sm font-medium">{worker.rating}</span></div>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="size-3.5" />{worker.phone}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="size-3.5" /><span className="truncate">{worker.email}</span></div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="flex-1">Bellen</Button>
                    <Button size="sm" className="flex-1">E-mailen</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
