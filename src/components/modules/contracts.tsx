"use client"

import { useState } from "react"
import { FileText, Plus, Upload, Eye, Trash2, Search, Download, Send, X, File } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ContractTemplate = {
  id: string
  name: string
  category: "huurovereenkomst" | "plaatsbeschrijving" | "opzeg" | "addendum" | "overig"
  uploadedAt: string
  fileSize: string
  pdfUrl: string | null
}

const categoryLabels: Record<string, string> = {
  huurovereenkomst: "Huurovereenkomst",
  plaatsbeschrijving: "Plaatsbeschrijving",
  opzeg: "Opzegging",
  addendum: "Addendum",
  overig: "Overig",
}

const categoryColors: Record<string, string> = {
  huurovereenkomst: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  plaatsbeschrijving: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  opzeg: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  addendum: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  overig: "bg-gray-100 text-gray-700 dark:bg-gray-800/40 dark:text-gray-300",
}

const initialTemplates: ContractTemplate[] = [
  { id: "ct1", name: "Standaard Huurovereenkomst - Woning", category: "huurovereenkomst", uploadedAt: "2025-12-01", fileSize: "245 KB", pdfUrl: null },
  { id: "ct2", name: "Standaard Huurovereenkomst - Appartement", category: "huurovereenkomst", uploadedAt: "2025-12-01", fileSize: "238 KB", pdfUrl: null },
  { id: "ct3", name: "Standaard Huurovereenkomst - Commercieel", category: "huurovereenkomst", uploadedAt: "2025-11-15", fileSize: "312 KB", pdfUrl: null },
  { id: "ct4", name: "Intredende Plaatsbeschrijving", category: "plaatsbeschrijving", uploadedAt: "2025-10-20", fileSize: "180 KB", pdfUrl: null },
  { id: "ct5", name: "Uittredende Plaatsbeschrijving", category: "plaatsbeschrijving", uploadedAt: "2025-10-20", fileSize: "175 KB", pdfUrl: null },
  { id: "ct6", name: "Opzeggingsbrief Huurder", category: "opzeg", uploadedAt: "2025-09-10", fileSize: "95 KB", pdfUrl: null },
  { id: "ct7", name: "Opzeggingsbrief Verhuurder", category: "opzeg", uploadedAt: "2025-09-10", fileSize: "102 KB", pdfUrl: null },
  { id: "ct8", name: "Addendum Huurprijswijziging", category: "addendum", uploadedAt: "2026-01-15", fileSize: "88 KB", pdfUrl: null },
]

export function ContractView({ property, onBack, backLabel }: { property: { name: string; id: string }; onBack: () => void; backLabel?: string }) {
  const [templates] = useState<ContractTemplate[]>(initialTemplates)
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>&larr; {backLabel || "Terug"}</Button>
        <h3 className="text-lg font-semibold">Contract kiezen voor {property.name}</h3>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {templates.filter(t => t.category === "huurovereenkomst").map((t) => (
          <Card key={t.id} className="cursor-pointer hover:shadow-md transition-all" onClick={() => setSelectedTemplate(t)}>
            <CardContent className="p-4 flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40 shrink-0">
                <FileText className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.fileSize}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedTemplate && (
        <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
          <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{selectedTemplate.name}</DialogTitle>
              <DialogDescription>Preview voor {property.name}</DialogDescription>
            </DialogHeader>
            <div className="flex-1 min-h-0 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <File className="size-16 mx-auto mb-3 opacity-30" />
                <p className="font-medium">PDF Preview</p>
                <p className="text-sm mt-1">Upload een PDF in Contract Templates om preview te activeren</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedTemplate(null)}>Sluiten</Button>
              <Button><Send className="size-4 mr-2" />Versturen naar huurder</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export function ContractsModule() {
  const [templates, setTemplates] = useState<ContractTemplate[]>(initialTemplates)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [viewingTemplate, setViewingTemplate] = useState<ContractTemplate | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadName, setUploadName] = useState("")
  const [uploadCategory, setUploadCategory] = useState<string>("huurovereenkomst")
  const [uploadFile, setUploadFile] = useState<globalThis.File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const filtered = templates
    .filter((t) => categoryFilter === "all" || t.category === categoryFilter)
    .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setUploadFile(file)
      setUploadName(file.name.replace(".pdf", ""))
    }
  }

  const handleUpload = () => {
    if (!uploadName) return
    const newTemplate: ContractTemplate = {
      id: "ct" + (templates.length + 1),
      name: uploadName,
      category: uploadCategory as ContractTemplate["category"],
      uploadedAt: new Date().toISOString().split("T")[0],
      fileSize: uploadFile ? (uploadFile.size / 1024).toFixed(0) + " KB" : "0 KB",
      pdfUrl: uploadFile ? URL.createObjectURL(uploadFile) : null,
    }
    setTemplates((prev) => [newTemplate, ...prev])
    setUploadOpen(false)
    setUploadName("")
    setUploadFile(null)
    setUploadCategory("huurovereenkomst")
  }

  const handleView = (template: ContractTemplate) => {
    setViewingTemplate(template)
    setPreviewUrl(template.pdfUrl)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Contract Templates</h2>
          <p className="text-muted-foreground">Beheer uw contract-templates en upload PDF-documenten</p>
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Plus className="size-4 mr-2" /> Template Uploaden
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Zoek template..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Categorie" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle categorieën</SelectItem>
            <SelectItem value="huurovereenkomst">Huurovereenkomst</SelectItem>
            <SelectItem value="plaatsbeschrijving">Plaatsbeschrijving</SelectItem>
            <SelectItem value="opzeg">Opzegging</SelectItem>
            <SelectItem value="addendum">Addendum</SelectItem>
            <SelectItem value="overig">Overig</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        {Object.entries(categoryLabels).map(([key, label]) => {
          const count = templates.filter((t) => t.category === key).length
          return (
            <Card key={key} className="cursor-pointer hover:shadow-md transition-all" onClick={() => setCategoryFilter(key)}>
              <CardContent className="pt-6 pb-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <Badge className={categoryColors[key]}>{count}</Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Template List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {filtered.map((template) => (
              <div key={template.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted shrink-0">
                  <FileText className="size-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{template.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className={categoryColors[template.category] + " text-xs"}>
                      {categoryLabels[template.category]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{template.fileSize}</span>
                    <span className="text-xs text-muted-foreground">{template.uploadedAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleView(template)} title="Bekijken">
                    <Eye className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Downloaden">
                    <Download className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setTemplates((prev) => prev.filter((t) => t.id !== template.id))} title="Verwijderen" className="text-destructive hover:text-destructive">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <FileText className="size-10 mx-auto mb-2 opacity-30" />
                <p>Geen templates gevonden</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Template Uploaden</DialogTitle>
            <DialogDescription>Upload een PDF-document als contract template</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">PDF Bestand</label>
              <div className="mt-1 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => document.getElementById("pdf-upload")?.click()}
              >
                {uploadFile ? (
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="size-5 text-primary" />
                    <span className="text-sm font-medium">{uploadFile.name}</span>
                  </div>
                ) : (
                  <>
                    <Upload className="size-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Klik om een PDF te selecteren</p>
                  </>
                )}
                <input id="pdf-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Template naam</label>
              <Input value={uploadName} onChange={(e) => setUploadName(e.target.value)} placeholder="Bijv. Standaard Huurovereenkomst" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Categorie</label>
              <Select value={uploadCategory} onValueChange={setUploadCategory}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="huurovereenkomst">Huurovereenkomst</SelectItem>
                  <SelectItem value="plaatsbeschrijving">Plaatsbeschrijving</SelectItem>
                  <SelectItem value="opzeg">Opzegging</SelectItem>
                  <SelectItem value="addendum">Addendum</SelectItem>
                  <SelectItem value="overig">Overig</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>Annuleren</Button>
            <Button onClick={handleUpload} disabled={!uploadName}>
              <Upload className="size-4 mr-2" /> Uploaden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF Viewer Dialog */}
      <Dialog open={!!viewingTemplate} onOpenChange={() => { setViewingTemplate(null); setPreviewUrl(null) }}>
        <DialogContent className="max-w-5xl h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="size-5" />
              {viewingTemplate?.name}
            </DialogTitle>
            <DialogDescription>
              {viewingTemplate && (
                <span className="flex items-center gap-2 mt-1">
                  <Badge className={categoryColors[viewingTemplate.category] + " text-xs"}>
                    {categoryLabels[viewingTemplate.category]}
                  </Badge>
                  {viewingTemplate.fileSize}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0 rounded-lg overflow-hidden border bg-muted">
            {previewUrl ? (
              <iframe src={previewUrl} className="w-full h-full" title="PDF Viewer" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <File className="size-16 mb-3 opacity-30" />
                <p className="font-medium">Geen PDF beschikbaar</p>
                <p className="text-sm mt-1">Dit is een demo template. Upload een PDF om de viewer te gebruiken.</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={() => document.getElementById("pdf-replace")?.click()}>
                  <Upload className="size-4 mr-2" /> PDF Uploaden
                </Button>
                <input id="pdf-replace" type="file" accept=".pdf" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const url = URL.createObjectURL(file)
                    setPreviewUrl(url)
                    if (viewingTemplate) {
                      setTemplates(prev => prev.map(t => t.id === viewingTemplate.id ? { ...t, pdfUrl: url } : t))
                    }
                  }
                }} />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setViewingTemplate(null); setPreviewUrl(null) }}>Sluiten</Button>
            <Button><Download className="size-4 mr-2" /> Downloaden</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
