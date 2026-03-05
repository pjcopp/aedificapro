"use client"

import { useState } from "react"
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { invoices, properties, tenants } from "@/lib/mock-data"
import type { Invoice } from "@/lib/mock-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const statusColors: Record<string, string> = {
  paid: "bg-green-500/10 text-green-600 border-green-500/30",
  pending: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  overdue: "bg-red-500/10 text-red-600 border-red-500/30",
}

const statusLabels: Record<string, string> = { paid: "Betaald", pending: "In Afwachting", overdue: "Achterstallig" }

export function InvoicingModule() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const filtered = invoices.filter((i) => statusFilter === "all" || i.status === statusFilter)
  const totalPaid = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0)
  const totalPending = invoices.filter((i) => i.status === "pending").reduce((s, i) => s + i.total, 0)
  const totalOverdue = invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + i.total, 0)

  if (selectedInvoice) {
    const property = properties.find((p) => p.id === selectedInvoice.propertyId)
    const tenant = tenants.find((t) => t.id === selectedInvoice.tenantId)
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" onClick={() => setSelectedInvoice(null)}>&larr; Terug naar Facturen</Button>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Factuur #{selectedInvoice.id.toUpperCase()}</CardTitle>
                <CardDescription>{selectedInvoice.month} - {property?.name}</CardDescription>
              </div>
              <Badge variant="outline" className={statusColors[selectedInvoice.status]}>{statusLabels[selectedInvoice.status]}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div><h4 className="font-medium mb-2">Pand</h4><p className="text-sm text-muted-foreground">{property?.name}</p><p className="text-sm text-muted-foreground">{property?.address}, {property?.city}</p></div>
              <div><h4 className="font-medium mb-2">Huurder</h4><p className="text-sm text-muted-foreground">{tenant?.name}</p><p className="text-sm text-muted-foreground">{tenant?.email}</p></div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Kostenuitsplitsing</h4>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b"><span>Huur</span><span className="font-medium">&euro;{selectedInvoice.rent.toLocaleString()}</span></div>
                <div className="flex justify-between py-2 border-b"><span>Elektriciteit</span><span className="font-medium">&euro;{selectedInvoice.electricity}</span></div>
                <div className="flex justify-between py-2 border-b"><span>Water</span><span className="font-medium">&euro;{selectedInvoice.water}</span></div>
                {selectedInvoice.gas > 0 && <div className="flex justify-between py-2 border-b"><span>Gas</span><span className="font-medium">&euro;{selectedInvoice.gas}</span></div>}
                <div className="flex justify-between py-2 border-b"><span>Internet</span><span className="font-medium">&euro;{selectedInvoice.internet}</span></div>
                {selectedInvoice.maintenance > 0 && <div className="flex justify-between py-2 border-b"><span>Onderhoud</span><span className="font-medium">&euro;{selectedInvoice.maintenance}</span></div>}
                <div className="flex justify-between py-3 font-bold text-lg"><span>Totaal</span><span>&euro;{selectedInvoice.total.toLocaleString()}</span></div>
              </div>
            </div>
            <div className="h-[200px]">
              <h4 className="font-medium mb-3">Verdeling</h4>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: "Huur", bedrag: selectedInvoice.rent },
                  { name: "Elektriciteit", bedrag: selectedInvoice.electricity },
                  { name: "Water", bedrag: selectedInvoice.water },
                  { name: "Gas", bedrag: selectedInvoice.gas },
                  { name: "Internet", bedrag: selectedInvoice.internet },
                  ...(selectedInvoice.maintenance > 0 ? [{ name: "Onderhoud", bedrag: selectedInvoice.maintenance }] : []),
                ]} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" tick={{ fill: "currentColor" }} />
                  <YAxis dataKey="name" type="category" width={80} tick={{ fill: "currentColor" }} />
                  <Tooltip formatter={(value: number) => [`€${value}`, "Bedrag"]} />
                  <Bar dataKey="bedrag" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold tracking-tight">Facturatie</h2><p className="text-muted-foreground">Facturering, nutsvoorzieningen en betalingsopvolging</p></div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="flex items-center gap-3 p-4"><div className="flex size-10 items-center justify-center rounded-full bg-green-500/10"><CheckCircle2 className="size-5 text-green-500" /></div><div><p className="text-2xl font-bold">&euro;{totalPaid.toLocaleString()}</p><p className="text-xs text-muted-foreground">Betaald</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><div className="flex size-10 items-center justify-center rounded-full bg-orange-500/10"><Clock className="size-5 text-orange-500" /></div><div><p className="text-2xl font-bold">&euro;{totalPending.toLocaleString()}</p><p className="text-xs text-muted-foreground">In Afwachting</p></div></CardContent></Card>
        <Card><CardContent className="flex items-center gap-3 p-4"><div className="flex size-10 items-center justify-center rounded-full bg-red-500/10"><AlertTriangle className="size-5 text-red-500" /></div><div><p className="text-2xl font-bold">&euro;{totalOverdue.toLocaleString()}</p><p className="text-xs text-muted-foreground">Achterstallig</p></div></CardContent></Card>
      </div>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Alle Status</SelectItem>
          <SelectItem value="paid">Betaald</SelectItem>
          <SelectItem value="pending">In Afwachting</SelectItem>
          <SelectItem value="overdue">Achterstallig</SelectItem>
        </SelectContent>
      </Select>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Factuur</TableHead><TableHead>Pand</TableHead><TableHead>Periode</TableHead><TableHead>Huur</TableHead><TableHead>Nutsvoorz.</TableHead><TableHead>Totaal</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {filtered.map((inv) => {
                const property = properties.find((p) => p.id === inv.propertyId)
                const utilities = inv.electricity + inv.water + inv.gas + inv.internet + inv.maintenance
                return (
                  <TableRow key={inv.id} className="cursor-pointer" onClick={() => setSelectedInvoice(inv)}>
                    <TableCell className="font-medium">{inv.id.toUpperCase()}</TableCell>
                    <TableCell>{property?.name}</TableCell>
                    <TableCell>{inv.month}</TableCell>
                    <TableCell>&euro;{inv.rent.toLocaleString()}</TableCell>
                    <TableCell>&euro;{utilities}</TableCell>
                    <TableCell className="font-medium">&euro;{inv.total.toLocaleString()}</TableCell>
                    <TableCell><Badge variant="outline" className={statusColors[inv.status]}>{statusLabels[inv.status]}</Badge></TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
