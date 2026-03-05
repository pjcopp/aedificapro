"use client"

import { useState } from "react"
import { Search, Phone, Mail, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { tenants, properties, paymentHistory } from "@/lib/mock-data"

export function TenantsModule() {
  const [search, setSearch] = useState("")

  const tenantsWithProperty = tenants.map((t) => ({
    ...t,
    property: properties.find((p) => p.id === t.propertyId),
  }))

  const filtered = tenantsWithProperty.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.phone.includes(search)
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Huurders</h2>
        <p className="text-muted-foreground">Overzicht van alle huidige huurders</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input placeholder="Zoek huurders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Huurder</TableHead>
                <TableHead>Pand</TableHead>
                <TableHead>Telefoon</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Inhuisdatum</TableHead>
                <TableHead>Betalingsscore</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">{tenant.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{tenant.name}</p>
                        <p className="text-xs text-muted-foreground">{tenant.address}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="secondary">{tenant.property?.name}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm"><Phone className="size-3.5 text-muted-foreground" />{tenant.phone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm"><Mail className="size-3.5 text-muted-foreground" />{tenant.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm"><Calendar className="size-3.5 text-muted-foreground" />{tenant.moveInDate}</div>
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const history = paymentHistory[tenant.id]
                      if (!history) return <span className="text-xs text-muted-foreground">-</span>
                      const color = history.score >= 90 ? "text-green-600 bg-green-500/10" : history.score >= 80 ? "text-orange-600 bg-orange-500/10" : "text-red-600 bg-red-500/10"
                      return (
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color}`}>{history.score}%</span>
                          <span className="text-xs text-muted-foreground">{history.onTime}x op tijd, {history.late}x laat</span>
                        </div>
                      )
                    })()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
