"use client"

import { useState } from "react"
import { CheckCircle2, Clock, AlertTriangle, Send, FileText, ArrowDownLeft, ArrowUpRight, Euro } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { invoices, properties, tenants, paymentTracking } from "@/lib/mock-data"
import type { Invoice } from "@/lib/mock-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const statusColors: Record<string, string> = {
  paid: "bg-green-500/10 text-green-600 border-green-500/30",
  pending: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  overdue: "bg-red-500/10 text-red-600 border-red-500/30",
  draft: "bg-gray-500/10 text-gray-600 border-gray-500/30",
}

const statusLabels: Record<string, string> = {
  paid: "Betaald",
  pending: "In Afwachting",
  overdue: "Achterstallig",
  draft: "Concept",
}

export function InvoicingModule() {
  const [mainTab, setMainTab] = useState("betalingsopvolging")
  const [invoiceSubTab, setInvoiceSubTab] = useState("uitgaand")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  // --- Payment tracking totals ---
  const ptPaid = paymentTracking.filter((p) => p.status === "paid").reduce((s, p) => s + p.total, 0)
  const ptPending = paymentTracking.filter((p) => p.status === "pending").reduce((s, p) => s + p.total, 0)
  const ptOverdue = paymentTracking.filter((p) => p.status === "overdue").reduce((s, p) => s + p.total, 0)

  // --- Invoice totals ---
  const uitgaand = invoices.filter((i) => i.direction === "uitgaand")
  const inkomend = invoices.filter((i) => i.direction === "inkomend")

  const uitgaandTotal = uitgaand.reduce((s, i) => s + i.total, 0)
  const inkomendTotal = inkomend.reduce((s, i) => s + i.total, 0)
  const uitgaandPending = uitgaand.filter((i) => i.status === "pending" || i.status === "overdue").reduce((s, i) => s + i.total, 0)
  const inkomendPending = inkomend.filter((i) => i.status === "pending" || i.status === "overdue").reduce((s, i) => s + i.total, 0)

  // --- Filtered invoices ---
  const filteredUitgaand = uitgaand.filter((i) => statusFilter === "all" || i.status === statusFilter)
  const filteredInkomend = inkomend.filter((i) => statusFilter === "all" || i.status === statusFilter)
  const filteredPayments = paymentTracking.filter((p) => statusFilter === "all" || p.status === statusFilter)

  // --- Invoice detail view ---
  if (selectedInvoice) {
    const property = properties.find((p) => p.id === selectedInvoice.propertyId)
    const tenant = selectedInvoice.tenantId ? tenants.find((t) => t.id === selectedInvoice.tenantId) : null
    const isUitgaand = selectedInvoice.direction === "uitgaand"
    const isInkomend = selectedInvoice.direction === "inkomend"

    const costBreakdown: { name: string; bedrag: number }[] = []
    if (isUitgaand) {
      if (selectedInvoice.rent > 0) costBreakdown.push({ name: "Huur", bedrag: selectedInvoice.rent })
      if (selectedInvoice.commonCosts > 0) costBreakdown.push({ name: "Gemeenschappelijke kosten", bedrag: selectedInvoice.commonCosts })
      if (selectedInvoice.propertyTax > 0) costBreakdown.push({ name: "Onroerende voorheffing", bedrag: selectedInvoice.propertyTax })
      if (selectedInvoice.insuranceCosts > 0) costBreakdown.push({ name: "Verzekering", bedrag: selectedInvoice.insuranceCosts })
    }
    if (isInkomend) {
      if (selectedInvoice.maintenance > 0) costBreakdown.push({ name: "Onderhoud / Werk", bedrag: selectedInvoice.maintenance })
    }
    if (selectedInvoice.vatAmount > 0) costBreakdown.push({ name: `BTW (${selectedInvoice.vatRate}%)`, bedrag: selectedInvoice.vatAmount })

    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => setSelectedInvoice(null)}>&larr; Terug naar Facturen</Button>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Factuur #{selectedInvoice.id.toUpperCase()}
                  <Badge variant="outline" className={isUitgaand ? "bg-blue-500/10 text-blue-600 border-blue-500/30" : "bg-purple-500/10 text-purple-600 border-purple-500/30"}>
                    {isUitgaand ? "Uitgaand" : "Inkomend"}
                  </Badge>
                </CardTitle>
                <CardDescription>{selectedInvoice.month} - {property?.name}</CardDescription>
              </div>
              <Badge variant="outline" className={statusColors[selectedInvoice.status]}>{statusLabels[selectedInvoice.status]}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Pand</h4>
                <p className="text-sm text-muted-foreground">{property?.name}</p>
                <p className="text-sm text-muted-foreground">{property?.address}, {property?.city}</p>
              </div>
              {isUitgaand && tenant && (
                <div>
                  <h4 className="font-medium mb-2">Huurder</h4>
                  <p className="text-sm text-muted-foreground">{tenant.name}</p>
                  <p className="text-sm text-muted-foreground">{tenant.email}</p>
                </div>
              )}
              {isInkomend && selectedInvoice.supplierName && (
                <div>
                  <h4 className="font-medium mb-2">Leverancier</h4>
                  <p className="text-sm text-muted-foreground">{selectedInvoice.supplierName}</p>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-medium mb-2">Omschrijving</h4>
              <p className="text-sm text-muted-foreground">{selectedInvoice.description}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Vervaldatum</h4>
              <p className="text-sm text-muted-foreground">{selectedInvoice.dueDate}</p>
            </div>

            <div>
              <h4 className="font-medium mb-3">Kostenuitsplitsing</h4>
              <div className="space-y-2">
                {isUitgaand && (
                  <>
                    {selectedInvoice.rent > 0 && <div className="flex justify-between py-2 border-b"><span>Huur</span><span className="font-medium">&euro;{selectedInvoice.rent.toLocaleString()}</span></div>}
                    {selectedInvoice.commonCosts > 0 && <div className="flex justify-between py-2 border-b"><span>Gemeenschappelijke kosten</span><span className="font-medium">&euro;{selectedInvoice.commonCosts.toLocaleString()}</span></div>}
                    {selectedInvoice.propertyTax > 0 && <div className="flex justify-between py-2 border-b"><span>Onroerende voorheffing</span><span className="font-medium">&euro;{selectedInvoice.propertyTax.toLocaleString()}</span></div>}
                    {selectedInvoice.insuranceCosts > 0 && <div className="flex justify-between py-2 border-b"><span>Verzekering</span><span className="font-medium">&euro;{selectedInvoice.insuranceCosts.toLocaleString()}</span></div>}
                  </>
                )}
                {isInkomend && selectedInvoice.maintenance > 0 && (
                  <div className="flex justify-between py-2 border-b"><span>Onderhoud / Werk</span><span className="font-medium">&euro;{selectedInvoice.maintenance.toLocaleString()}</span></div>
                )}
                <div className="flex justify-between py-2 border-b text-muted-foreground">
                  <span>BTW ({selectedInvoice.vatRate}%)</span>
                  <span className="font-medium">&euro;{selectedInvoice.vatAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-3 font-bold text-lg"><span>Totaal (incl. BTW)</span><span>&euro;{selectedInvoice.total.toLocaleString()}</span></div>
              </div>
            </div>

            {costBreakdown.length > 1 && (
              <div className="h-[200px]">
                <h4 className="font-medium mb-3">Verdeling</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={costBreakdown} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" tick={{ fill: "currentColor" }} />
                    <YAxis dataKey="name" type="category" width={160} tick={{ fill: "currentColor", fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => [`\u20AC${value}`, "Bedrag"]} />
                    <Bar dataKey="bedrag" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
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
        <h2 className="text-2xl font-bold tracking-tight">Facturatie &amp; Betalingen</h2>
        <p className="text-muted-foreground">Betalingsopvolging, facturering en financieel overzicht</p>
      </div>

      <Tabs value={mainTab} onValueChange={setMainTab}>
        <TabsList>
          <TabsTrigger value="betalingsopvolging" className="gap-1.5"><Euro className="size-4" /> Betalingsopvolging</TabsTrigger>
          <TabsTrigger value="facturatie" className="gap-1.5"><FileText className="size-4" /> Facturatie</TabsTrigger>
        </TabsList>

        {/* ══════════════════════════════════════════════════════════════════════
            BETALINGSOPVOLGING TAB - residential tenants, contract-based
           ══════════════════════════════════════════════════════════════════════ */}
        <TabsContent value="betalingsopvolging" className="space-y-6">
          {/* Summary cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-green-500/10">
                  <CheckCircle2 className="size-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">&euro;{ptPaid.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Betaald</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-orange-500/10">
                  <Clock className="size-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">&euro;{ptPending.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">In Afwachting</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-red-500/10">
                  <AlertTriangle className="size-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">&euro;{ptOverdue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Achterstallig</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Status</SelectItem>
              <SelectItem value="paid">Betaald</SelectItem>
              <SelectItem value="pending">In Afwachting</SelectItem>
              <SelectItem value="overdue">Achterstallig</SelectItem>
            </SelectContent>
          </Select>

          {/* Payment tracking table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Huurbetalingen (residentieel)</CardTitle>
              <CardDescription>Contractuele betalingen van residentiële huurders - geen factuur, op basis van huurovereenkomst</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pand</TableHead>
                    <TableHead>Huurder</TableHead>
                    <TableHead>Maand</TableHead>
                    <TableHead>Basishuur</TableHead>
                    <TableHead>Kosten</TableHead>
                    <TableHead>Totaal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actie</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((pt, idx) => {
                    const property = properties.find((p) => p.id === pt.propertyId)
                    const tenant = tenants.find((t) => t.id === pt.tenantId)
                    return (
                      <TableRow key={`${pt.propertyId}-${pt.month}-${idx}`}>
                        <TableCell className="font-medium">{property?.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {tenant && (
                              <Avatar className="size-7 shrink-0">
                                <AvatarImage src={tenant.photoUrl} alt={tenant.name} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">{tenant.avatar}</AvatarFallback>
                              </Avatar>
                            )}
                            <span>{tenant?.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{pt.month}</TableCell>
                        <TableCell>&euro;{pt.baseRent.toLocaleString()}</TableCell>
                        <TableCell>&euro;{pt.commonCosts.toLocaleString()}</TableCell>
                        <TableCell className="font-medium">&euro;{pt.total.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColors[pt.status]}>{statusLabels[pt.status]}</Badge>
                        </TableCell>
                        <TableCell>
                          {(pt.status === "pending" || pt.status === "overdue") && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                              onClick={() => alert(`Herinnering verzonden via WhatsApp en e-mail naar ${tenant?.name || "huurder"}`)}
                            >
                              <Send className="size-3 mr-1" /> Herinnering
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ══════════════════════════════════════════════════════════════════════
            FACTURATIE TAB - invoices (uitgaand & inkomend)
           ══════════════════════════════════════════════════════════════════════ */}
        <TabsContent value="facturatie" className="space-y-6">
          {/* Summary cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-blue-500/10">
                  <ArrowUpRight className="size-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">&euro;{uitgaandTotal.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Uitgaand totaal</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-orange-500/10">
                  <Clock className="size-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">&euro;{uitgaandPending.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Uitgaand openstaand</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-purple-500/10">
                  <ArrowDownLeft className="size-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">&euro;{inkomendTotal.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Inkomend totaal</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-red-500/10">
                  <AlertTriangle className="size-5 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">&euro;{inkomendPending.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Inkomend openstaand</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Status</SelectItem>
              <SelectItem value="paid">Betaald</SelectItem>
              <SelectItem value="pending">In Afwachting</SelectItem>
              <SelectItem value="overdue">Achterstallig</SelectItem>
              <SelectItem value="draft">Concept</SelectItem>
            </SelectContent>
          </Select>

          {/* Sub-tabs for uitgaand / inkomend */}
          <Tabs value={invoiceSubTab} onValueChange={setInvoiceSubTab}>
            <TabsList>
              <TabsTrigger value="uitgaand" className="gap-1.5"><ArrowUpRight className="size-3.5" /> Uitgaande facturen</TabsTrigger>
              <TabsTrigger value="inkomend" className="gap-1.5"><ArrowDownLeft className="size-3.5" /> Inkomende facturen</TabsTrigger>
            </TabsList>

            {/* ── Uitgaande facturen (verkoop - commercieel) ─────────────── */}
            <TabsContent value="uitgaand" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Uitgaande facturen (verkoop)</CardTitle>
                  <CardDescription>Facturen naar commerciële huurders - met BTW-berekening</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Factuur</TableHead>
                        <TableHead>Pand</TableHead>
                        <TableHead>Huurder</TableHead>
                        <TableHead>Periode</TableHead>
                        <TableHead>Huur</TableHead>
                        <TableHead>Kosten</TableHead>
                        <TableHead>BTW</TableHead>
                        <TableHead>Totaal</TableHead>
                        <TableHead>Vervaldatum</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUitgaand.map((inv) => {
                        const property = properties.find((p) => p.id === inv.propertyId)
                        const tenant = inv.tenantId ? tenants.find((t) => t.id === inv.tenantId) : null
                        const extraCosts = inv.commonCosts + inv.propertyTax + inv.insuranceCosts
                        return (
                          <TableRow key={inv.id} className="cursor-pointer" onClick={() => setSelectedInvoice(inv)}>
                            <TableCell className="font-medium">{inv.id.toUpperCase()}</TableCell>
                            <TableCell>{property?.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {tenant && (
                                  <Avatar className="size-7 shrink-0">
                                    <AvatarImage src={tenant.photoUrl} alt={tenant.name} />
                                    <AvatarFallback className="bg-primary/10 text-primary text-xs">{tenant.avatar}</AvatarFallback>
                                  </Avatar>
                                )}
                                <span>{tenant?.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{inv.month}</TableCell>
                            <TableCell>&euro;{inv.rent.toLocaleString()}</TableCell>
                            <TableCell>&euro;{extraCosts.toLocaleString()}</TableCell>
                            <TableCell className="text-muted-foreground">&euro;{inv.vatAmount.toLocaleString()}</TableCell>
                            <TableCell className="font-medium">&euro;{inv.total.toLocaleString()}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{inv.dueDate}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={statusColors[inv.status]}>{statusLabels[inv.status]}</Badge>
                            </TableCell>
                            <TableCell>
                              {(inv.status === "pending" || inv.status === "overdue") && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    alert(`Herinnering verzonden naar ${tenant?.name || "huurder"}`)
                                  }}
                                >
                                  <Send className="size-3 mr-1" /> Herinnering
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                      {filteredUitgaand.length === 0 && (
                        <TableRow><TableCell colSpan={11} className="text-center py-8 text-muted-foreground">Geen facturen gevonden</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Inkomende facturen (aankoop - leveranciers) ────────────── */}
            <TabsContent value="inkomend" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Inkomende facturen (aankoop)</CardTitle>
                  <CardDescription>Facturen van aannemers en leveranciers voor onderhoud en werken</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Factuur</TableHead>
                        <TableHead>Pand</TableHead>
                        <TableHead>Leverancier</TableHead>
                        <TableHead>Omschrijving</TableHead>
                        <TableHead>Periode</TableHead>
                        <TableHead>Bedrag excl.</TableHead>
                        <TableHead>BTW</TableHead>
                        <TableHead>Totaal</TableHead>
                        <TableHead>Vervaldatum</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInkomend.map((inv) => {
                        const property = properties.find((p) => p.id === inv.propertyId)
                        return (
                          <TableRow key={inv.id} className="cursor-pointer" onClick={() => setSelectedInvoice(inv)}>
                            <TableCell className="font-medium">{inv.id.toUpperCase()}</TableCell>
                            <TableCell>{property?.name}</TableCell>
                            <TableCell>{inv.supplierName || "-"}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{inv.description}</TableCell>
                            <TableCell>{inv.month}</TableCell>
                            <TableCell>&euro;{inv.maintenance.toLocaleString()}</TableCell>
                            <TableCell className="text-muted-foreground">&euro;{inv.vatAmount.toLocaleString()}</TableCell>
                            <TableCell className="font-medium">&euro;{inv.total.toLocaleString()}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{inv.dueDate}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={statusColors[inv.status]}>{statusLabels[inv.status]}</Badge>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                      {filteredInkomend.length === 0 && (
                        <TableRow><TableCell colSpan={10} className="text-center py-8 text-muted-foreground">Geen facturen gevonden</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}
