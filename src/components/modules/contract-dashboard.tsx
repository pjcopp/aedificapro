"use client"

import { useState, useMemo, useCallback } from "react"
import { FileText, AlertTriangle, CheckCircle2, XCircle, Calendar, Building2, Home, Store, Clock, Eye, Download, Printer, Send } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { properties, owners, type Property } from "@/lib/mock-data"
import { generateContractPdf } from "@/lib/generate-contract-pdf"

const REFERENCE_DATE = new Date("2026-03-07")
const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000

type ContractStatus = "actief" | "verloopt_binnenkort" | "verlopen"

type ContractRow = {
  property: Property
  tenantName: string
  tenantPhoto: string
  tenantAvatar: string
  typeLabel: string
  baseRent: number
  commonCosts: number
  monthlyRent: number
  leaseStart: Date
  leaseEnd: Date
  status: ContractStatus
  remainingDays: number
  progressPercent: number
}

function getContractStatus(leaseEnd: Date): ContractStatus {
  const diff = leaseEnd.getTime() - REFERENCE_DATE.getTime()
  if (diff < 0) return "verlopen"
  if (diff <= SIX_MONTHS_MS) return "verloopt_binnenkort"
  return "actief"
}

function getDaysRemaining(leaseEnd: Date): number {
  const diff = leaseEnd.getTime() - REFERENCE_DATE.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function getProgressPercent(leaseStart: Date, leaseEnd: Date): number {
  const total = leaseEnd.getTime() - leaseStart.getTime()
  const elapsed = REFERENCE_DATE.getTime() - leaseStart.getTime()
  if (total <= 0) return 100
  const pct = (elapsed / total) * 100
  return Math.min(100, Math.max(0, pct))
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("nl-BE", { day: "2-digit", month: "2-digit", year: "numeric" })
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" }).format(n)
}

const statusConfig: Record<ContractStatus, { label: string; color: string; badgeClass: string }> = {
  actief: {
    label: "Actief",
    color: "text-green-600",
    badgeClass: "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700",
  },
  verloopt_binnenkort: {
    label: "Verloopt binnenkort",
    color: "text-orange-600",
    badgeClass: "bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700",
  },
  verlopen: {
    label: "Verlopen",
    color: "text-red-600",
    badgeClass: "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700",
  },
}

const typeLabels: Record<string, string> = {
  apartment: "Woning",
  house: "Woning",
  studio: "Woning",
  commercial: "Commercieel",
}

const typeIcons: Record<string, React.ReactNode> = {
  apartment: <Home className="size-4" />,
  house: <Home className="size-4" />,
  studio: <Home className="size-4" />,
  commercial: <Store className="size-4" />,
}

export function ContractDashboardModule() {
  const [statusFilter, setStatusFilter] = useState<string>("alle")
  const [selectedContract, setSelectedContract] = useState<ContractRow | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const handleViewPdf = useCallback((contract: ContractRow) => {
    const owner = owners.find(o => o.propertyIds.includes(contract.property.id))
    if (owner) {
      const url = generateContractPdf(contract.property, owner)
      setPdfUrl(url)
    }
  }, [])

  const contracts: ContractRow[] = useMemo(() => {
    return properties
      .filter((p) => p.tenant && p.leaseStart && p.leaseEnd)
      .map((p) => {
        const leaseStart = new Date(p.leaseStart!)
        const leaseEnd = new Date(p.leaseEnd!)
        const status = getContractStatus(leaseEnd)
        const remainingDays = getDaysRemaining(leaseEnd)
        const progressPercent = getProgressPercent(leaseStart, leaseEnd)

        return {
          property: p,
          tenantName: p.tenant!.name,
          tenantPhoto: p.tenant!.photoUrl,
          tenantAvatar: p.tenant!.avatar,
          typeLabel: typeLabels[p.type] || "Onbekend",
          baseRent: p.baseRent,
          commonCosts: p.commonCosts,
          monthlyRent: p.monthlyRent,
          leaseStart,
          leaseEnd,
          status,
          remainingDays,
          progressPercent,
        }
      })
      .sort((a, b) => a.leaseEnd.getTime() - b.leaseEnd.getTime())
  }, [])

  const filteredContracts = useMemo(() => {
    if (statusFilter === "alle") return contracts
    return contracts.filter((c) => c.status === statusFilter)
  }, [contracts, statusFilter])

  const totalActive = contracts.filter((c) => c.status === "actief").length
  const totalExpiringSoon = contracts.filter((c) => c.status === "verloopt_binnenkort").length
  const totalExpired = contracts.filter((c) => c.status === "verlopen").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Contracten Dashboard</h2>
          <p className="text-muted-foreground">Overzicht van alle actieve huurcontracten</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter op status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alle">Alle contracten</SelectItem>
              <SelectItem value="actief">Actief</SelectItem>
              <SelectItem value="verloopt_binnenkort">Verloopt binnenkort</SelectItem>
              <SelectItem value="verlopen">Verlopen</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/40">
                <CheckCircle2 className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Actieve contracten</p>
                <p className="text-2xl font-bold">{totalActive}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/40">
                <AlertTriangle className="size-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Verloopt binnen 6 maanden</p>
                <p className="text-2xl font-bold">{totalExpiringSoon}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/40">
                <XCircle className="size-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Verlopen contracten</p>
                <p className="text-2xl font-bold">{totalExpired}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contracts table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pand</TableHead>
                <TableHead>Huurder</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Basishuur</TableHead>
                <TableHead className="text-right">Kosten</TableHead>
                <TableHead className="text-right">Totaal</TableHead>
                <TableHead>Startdatum</TableHead>
                <TableHead>Einddatum</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Resterende dagen</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                    Geen contracten gevonden voor het geselecteerde filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredContracts.map((contract) => (
                  <TableRow
                    key={contract.property.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedContract(contract)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{contract.property.name}</p>
                        <p className="text-xs text-muted-foreground">{contract.property.address}, {contract.property.zipCode} {contract.property.city}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-7">
                          <AvatarImage src={contract.tenantPhoto} alt={contract.tenantName} />
                          <AvatarFallback className="text-xs">{contract.tenantAvatar}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{contract.tenantName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {typeIcons[contract.property.type]}
                        <span className="text-sm">{contract.typeLabel}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(contract.baseRent)}</TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(contract.commonCosts)}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{formatCurrency(contract.monthlyRent)}</TableCell>
                    <TableCell className="text-sm">{formatDate(contract.leaseStart)}</TableCell>
                    <TableCell className="text-sm">{formatDate(contract.leaseEnd)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusConfig[contract.status].badgeClass}>
                        {statusConfig[contract.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`text-sm font-medium ${contract.remainingDays <= 0 ? "text-red-600" : contract.remainingDays <= 180 ? "text-orange-600" : "text-green-600"}`}>
                        {contract.remainingDays <= 0 ? `${Math.abs(contract.remainingDays)} dagen geleden` : `${contract.remainingDays} dagen`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Bekijk PDF"
                        onClick={(e) => { e.stopPropagation(); handleViewPdf(contract) }}
                      >
                        <Eye className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail dialog */}
      <Dialog open={!!selectedContract} onOpenChange={(open) => { if (!open) setSelectedContract(null) }}>
        <DialogContent className="sm:max-w-2xl">
          {selectedContract && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="size-5" />
                  Contractdetails - {selectedContract.property.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedContract.property.address}, {selectedContract.property.zipCode} {selectedContract.property.city}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                {/* Tenant info */}
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Avatar className="size-12">
                    <AvatarImage src={selectedContract.tenantPhoto} alt={selectedContract.tenantName} />
                    <AvatarFallback>{selectedContract.tenantAvatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold">{selectedContract.tenantName}</p>
                    <p className="text-sm text-muted-foreground">{selectedContract.property.tenant?.email}</p>
                    <p className="text-sm text-muted-foreground">{selectedContract.property.tenant?.phone}</p>
                  </div>
                  <Badge variant="outline" className={statusConfig[selectedContract.status].badgeClass}>
                    {statusConfig[selectedContract.status].label}
                  </Badge>
                </div>

                {/* Contract timeline / progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="size-3.5" />
                      {formatDate(selectedContract.leaseStart)}
                    </span>
                    <span className="text-xs font-medium">
                      {selectedContract.progressPercent.toFixed(0)}% verstreken
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="size-3.5" />
                      {formatDate(selectedContract.leaseEnd)}
                    </span>
                  </div>
                  <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                        selectedContract.status === "verlopen"
                          ? "bg-red-500"
                          : selectedContract.status === "verloopt_binnenkort"
                          ? "bg-orange-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${selectedContract.progressPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-sm">
                    <Clock className="size-3.5" />
                    {selectedContract.remainingDays <= 0 ? (
                      <span className="text-red-600 font-medium">
                        Contract verlopen sinds {Math.abs(selectedContract.remainingDays)} dagen
                      </span>
                    ) : (
                      <span className={selectedContract.remainingDays <= 180 ? "text-orange-600 font-medium" : "text-green-600 font-medium"}>
                        Nog {selectedContract.remainingDays} dagen resterend
                      </span>
                    )}
                  </div>
                </div>

                {/* Financial details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3 rounded-lg border p-3">
                    <h4 className="text-sm font-semibold text-muted-foreground">Financieel overzicht</h4>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span>Basishuur</span>
                        <span>{formatCurrency(selectedContract.baseRent)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Gemeenschappelijke kosten</span>
                        <span>{formatCurrency(selectedContract.commonCosts)}</span>
                      </div>
                      <div className="border-t pt-1.5 flex justify-between text-sm font-semibold">
                        <span>Totaal maandelijks</span>
                        <span>{formatCurrency(selectedContract.monthlyRent)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 rounded-lg border p-3">
                    <h4 className="text-sm font-semibold text-muted-foreground">Pandgegevens</h4>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span>Type</span>
                        <span className="flex items-center gap-1">{typeIcons[selectedContract.property.type]} {selectedContract.typeLabel}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Oppervlakte</span>
                        <span>{selectedContract.property.sqm} m&sup2;</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>EPC-score</span>
                        <span>{selectedContract.property.epcScore}</span>
                      </div>
                      {selectedContract.property.floor !== null && (
                        <div className="flex justify-between text-sm">
                          <span>Verdieping</span>
                          <span>{selectedContract.property.floor}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Extra property details */}
                <div className="rounded-lg border p-3 space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">Aanvullende informatie</h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="size-3.5 text-muted-foreground" />
                      <span>Bouwjaar: {selectedContract.property.buildingYear}</span>
                    </div>
                    {selectedContract.property.renovatedYear && (
                      <div className="flex items-center gap-1.5">
                        <Building2 className="size-3.5 text-muted-foreground" />
                        <span>Gerenoveerd: {selectedContract.property.renovatedYear}</span>
                      </div>
                    )}
                    <div className="text-sm">Parking: {selectedContract.property.hasParking ? "Ja" : "Nee"}</div>
                    <div className="text-sm">Garage: {selectedContract.property.hasGarage ? "Ja" : "Nee"}</div>
                    <div className="text-sm">Lift: {selectedContract.property.hasElevator ? "Ja" : "Nee"}</div>
                    {selectedContract.property.familyMembers !== null && (
                      <div className="text-sm">Gezinsleden: {selectedContract.property.familyMembers}</div>
                    )}
                    <div className="text-sm">Huisdieren: {selectedContract.property.petsAllowed ? (selectedContract.property.petsPresent || "Toegestaan") : "Niet toegestaan"}</div>
                    <div className="text-sm">Roken: {selectedContract.property.smokingAllowed ? "Toegestaan" : "Niet toegestaan"}</div>
                  </div>
                </div>

                {/* Utilities */}
                {selectedContract.property.utilities.length > 0 && (
                  <div className="rounded-lg border p-3 space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground">Nutsvoorzieningen</h4>
                    <div className="grid grid-cols-2 gap-1.5">
                      {selectedContract.property.utilities.map((u) => (
                        <div key={u.name} className="flex justify-between text-sm">
                          <span>{u.name}</span>
                          <span>{formatCurrency(u.monthlyCost)}/maand</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PDF actions */}
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" onClick={() => handleViewPdf(selectedContract)}>
                    <Eye className="size-4 mr-2" /> Bekijk Contract PDF
                  </Button>
                  <Button variant="outline" onClick={() => {
                    handleViewPdf(selectedContract)
                    // Download is handled by the viewer
                  }}>
                    <Download className="size-4 mr-2" /> Download
                  </Button>
                  <Button variant="outline">
                    <Send className="size-4 mr-2" /> Versturen
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* PDF Viewer Dialog */}
      {pdfUrl && (
        <Dialog open onOpenChange={(open) => { if (!open) setPdfUrl(null) }}>
          <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0 gap-0">
            <div className="flex items-center justify-between border-b px-4 py-3 shrink-0">
              <div>
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <FileText className="size-4 text-primary" />
                  Huurovereenkomst - {selectedContract?.property.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{selectedContract?.tenantName}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Button variant="outline" size="sm" onClick={() => {
                  const a = document.createElement("a")
                  a.href = pdfUrl
                  a.download = `Huurovereenkomst - ${selectedContract?.property.name}.pdf`
                  a.click()
                }}>
                  <Download className="size-3.5 mr-1.5" /> Download
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  const w = window.open(pdfUrl)
                  if (w) setTimeout(() => w.print(), 500)
                }}>
                  <Printer className="size-3.5 mr-1.5" /> Print
                </Button>
                <Button size="sm">
                  <Send className="size-3.5 mr-1.5" /> Versturen naar huurder
                </Button>
              </div>
            </div>
            <div className="flex-1 min-h-0 bg-muted/50">
              <iframe src={pdfUrl + "#toolbar=1&navpanes=0"} className="w-full h-full border-0" title="Contract PDF" />
            </div>
            <div className="flex items-center justify-end border-t px-4 py-2.5 shrink-0">
              <Button variant="outline" size="sm" onClick={() => setPdfUrl(null)}>Sluiten</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
