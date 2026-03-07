"use client"

import { useState, useCallback } from "react"
import { FileText, Plus, Upload, Eye, Trash2, Search, Download, Send, File, Printer, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
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
import { properties, owners } from "@/lib/mock-data"
import { generateContractPdf, generateTemplatePdf } from "@/lib/generate-contract-pdf"

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

// ── PDF Viewer Component ─────────────────────────────────────────────────────

function PdfViewer({ url, onClose, title, subtitle, actions }: {
  url: string
  onClose: () => void
  title: string
  subtitle?: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0 gap-0">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b px-4 py-3 shrink-0">
          <div className="min-w-0">
            <h3 className="font-semibold text-sm truncate flex items-center gap-2">
              <FileText className="size-4 shrink-0 text-primary" />
              {title}
            </h3>
            {subtitle && <div className="mt-0.5">{subtitle}</div>}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const a = document.createElement("a")
                a.href = url
                a.download = `${title}.pdf`
                a.click()
              }}
            >
              <Download className="size-3.5 mr-1.5" /> Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const w = window.open(url)
                if (w) setTimeout(() => w.print(), 500)
              }}
            >
              <Printer className="size-3.5 mr-1.5" /> Print
            </Button>
            {actions}
          </div>
        </div>

        {/* PDF iframe */}
        <div className="flex-1 min-h-0 bg-muted/50">
          <iframe
            src={url + "#toolbar=1&navpanes=0"}
            className="w-full h-full border-0"
            title="PDF Viewer"
          />
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-end border-t px-4 py-2.5 shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>Sluiten</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── ContractView (used from Properties detail) ──────────────────────────────

export function ContractView({ property, onBack, backLabel }: { property: { name: string; id: string }; onBack: () => void; backLabel?: string }) {
  const [templates] = useState<ContractTemplate[]>(initialTemplates)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewTitle, setPreviewTitle] = useState("")

  const fullProperty = properties.find(p => p.id === property.id)
  const owner = fullProperty ? owners.find(o => o.propertyIds.includes(fullProperty.id)) : null

  const handlePreview = useCallback((template: ContractTemplate) => {
    if (template.pdfUrl) {
      setPreviewUrl(template.pdfUrl)
    } else if (fullProperty && owner && template.category === "huurovereenkomst") {
      const url = generateContractPdf(fullProperty, owner)
      setPreviewUrl(url)
    } else {
      const url = generateTemplatePdf(template.name, template.category, fullProperty, owner)
      setPreviewUrl(url)
    }
    setPreviewTitle(template.name)
  }, [fullProperty, owner])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>&larr; {backLabel || "Terug"}</Button>
        <h3 className="text-lg font-semibold">Contract kiezen voor {property.name}</h3>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {templates.filter(t => t.category === "huurovereenkomst").map((t) => (
          <Card key={t.id} className="cursor-pointer hover:shadow-md transition-all group" onClick={() => handlePreview(t)}>
            <CardContent className="p-4 flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40 shrink-0 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60 transition-colors">
                <FileText className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.fileSize}</p>
                <p className="text-xs text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Klik om preview te openen</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {previewUrl && (
        <PdfViewer
          url={previewUrl}
          onClose={() => { setPreviewUrl(null); setPreviewTitle("") }}
          title={previewTitle}
          subtitle={<span className="text-xs text-muted-foreground">Preview voor {property.name}</span>}
          actions={
            <Button size="sm">
              <Send className="size-3.5 mr-1.5" /> Versturen naar huurder
            </Button>
          }
        />
      )}
    </div>
  )
}

// ── ContractsModule (Templates management) ──────────────────────────────────

export function ContractsModule() {
  const [templates, setTemplates] = useState<ContractTemplate[]>(initialTemplates)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewTitle, setPreviewTitle] = useState("")
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadName, setUploadName] = useState("")
  const [uploadCategory, setUploadCategory] = useState<string>("huurovereenkomst")
  const [uploadFile, setUploadFile] = useState<globalThis.File | null>(null)

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

  const handleView = useCallback((template: ContractTemplate) => {
    if (template.pdfUrl) {
      // User-uploaded PDF
      setPreviewUrl(template.pdfUrl)
    } else {
      // Generate PDF from template
      // For huurovereenkomst templates, use first occupied property as demo
      const demoProperty = properties.find(p => p.tenant && p.leaseStart)
      const demoOwner = demoProperty ? owners.find(o => o.propertyIds.includes(demoProperty.id)) : null
      const url = generateTemplatePdf(template.name, template.category, demoProperty, demoOwner)
      setPreviewUrl(url)
    }
    setPreviewTitle(template.name)
  }, [])

  const handleDownload = useCallback((template: ContractTemplate) => {
    let url = template.pdfUrl
    if (!url) {
      const demoProperty = properties.find(p => p.tenant && p.leaseStart)
      const demoOwner = demoProperty ? owners.find(o => o.propertyIds.includes(demoProperty.id)) : null
      url = generateTemplatePdf(template.name, template.category, demoProperty, demoOwner)
    }
    const a = document.createElement("a")
    a.href = url
    a.download = `${template.name}.pdf`
    a.click()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Contract Templates</h2>
          <p className="text-muted-foreground">Beheer uw contract-templates en bekijk PDF-documenten</p>
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
            <SelectItem value="all">Alle categorie&euml;n</SelectItem>
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
                  <Button variant="ghost" size="icon" onClick={() => handleDownload(template)} title="Downloaden">
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

      {/* PDF Viewer */}
      {previewUrl && (
        <PdfViewer
          url={previewUrl}
          onClose={() => { setPreviewUrl(null); setPreviewTitle("") }}
          title={previewTitle}
        />
      )}
    </div>
  )
}
