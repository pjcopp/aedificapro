"use client"

import { useState } from "react"
import { Search, FileText, Image, FileSpreadsheet, BookOpen, Award, ClipboardList, Upload, FolderArchive } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { asBuiltDocuments, properties } from "@/lib/mock-data"

const typeIcons: Record<string, typeof FileText> = { datasheet: FileSpreadsheet, image: Image, blueprint: FileText, manual: BookOpen, certificate: Award, report: ClipboardList }
const typeColors: Record<string, string> = { datasheet: "text-blue-500 bg-blue-500/10", image: "text-purple-500 bg-purple-500/10", blueprint: "text-cyan-500 bg-cyan-500/10", manual: "text-orange-500 bg-orange-500/10", certificate: "text-green-500 bg-green-500/10", report: "text-gray-500 bg-gray-500/10" }

export function AsBuiltModule() {
  const [search, setSearch] = useState("")
  const [propertyFilter, setPropertyFilter] = useState("all")

  const filtered = asBuiltDocuments.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || doc.category.toLowerCase().includes(search.toLowerCase())
    const matchesProperty = propertyFilter === "all" || doc.propertyId === propertyFilter
    return matchesSearch && matchesProperty
  })

  const groupedByCategory = filtered.reduce((acc, doc) => { if (!acc[doc.category]) acc[doc.category] = []; acc[doc.category].push(doc); return acc }, {} as Record<string, typeof asBuiltDocuments>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold tracking-tight">As-Built</h2><p className="text-muted-foreground">Panddocumentatie, datasheets en media</p></div>
        <Button><Upload className="size-4 mr-2" /> Document Uploaden</Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input placeholder="Zoek documenten..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
        <Select value={propertyFilter} onValueChange={setPropertyFilter}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filter op pand" /></SelectTrigger>
          <SelectContent><SelectItem value="all">Alle Panden</SelectItem>{properties.map((p) => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}</SelectContent>
        </Select>
      </div>
      {Object.entries(groupedByCategory).map(([category, docs]) => (
        <div key={category}>
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">{category}</h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {docs.map((doc) => {
              const Icon = typeIcons[doc.type] || FileText
              const property = properties.find((p) => p.id === doc.propertyId)
              return (
                <Card key={doc.id} className="cursor-pointer transition-all hover:shadow-md hover:border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`flex size-10 items-center justify-center rounded-lg shrink-0 ${typeColors[doc.type]}`}><Icon className="size-5" /></div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-sm truncate">{doc.name}</h4>
                        <Badge variant="secondary" className="text-xs mt-1">{property?.name}</Badge>
                        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground"><span>{doc.size}</span><span>{doc.uploadedAt}</span></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}
      {Object.keys(groupedByCategory).length === 0 && (
        <Card><CardContent className="py-12 text-center text-muted-foreground"><FolderArchive className="size-12 mx-auto mb-3 opacity-30" /><p>Geen documenten gevonden</p></CardContent></Card>
      )}
    </div>
  )
}
