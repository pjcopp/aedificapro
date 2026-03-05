"use client"

import { Building2, Users, Receipt, Ticket, TrendingUp, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { properties, tickets, invoices, analyticsData } from "@/lib/mock-data"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts"

export function DashboardModule() {
  const totalProperties = properties.length
  const occupiedCount = properties.filter((p) => p.status === "occupied").length
  const availableCount = properties.filter((p) => p.status === "available").length
  const maintenanceCount = properties.filter((p) => p.status === "maintenance").length
  const totalMonthlyRevenue = properties.filter((p) => p.status === "occupied").reduce((sum, p) => sum + p.monthlyRent, 0)
  const totalAnnualRevenue = totalMonthlyRevenue * 12
  const openTickets = tickets.filter((t) => t.status === "open" || t.status === "in-progress").length
  const pendingInvoices = invoices.filter((i) => i.status === "pending" || i.status === "overdue").length

  const statusData = [
    { name: "Verhuurd", value: occupiedCount, color: "#22c55e" },
    { name: "Beschikbaar", value: availableCount, color: "#3b82f6" },
    { name: "Onderhoud", value: maintenanceCount, color: "#f59e0b" },
  ]

  const monthlyOverview = analyticsData.revenueHistory.map((r, i) => {
    const expenses = analyticsData.monthlyExpenses[i]
    const totalExpenses = expenses
      ? expenses.onderhoud + expenses.verzekering + expenses.belasting + expenses.overig
      : 0
    return { month: r.month, inkomsten: r.revenue, kosten: totalExpenses }
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overzicht van uw vastgoedportefeuille</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Totaal Panden</CardTitle>
            <Building2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProperties}</div>
            <p className="text-xs text-muted-foreground">{occupiedCount} verhuurd, {availableCount} beschikbaar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Maandelijkse Inkomsten</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">&euro;{totalMonthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">&euro;{totalAnnualRevenue.toLocaleString()} / jaar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <Ticket className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTickets}</div>
            <p className="text-xs text-muted-foreground">{tickets.filter((t) => t.priority === "urgent" || t.priority === "high").length} hoge prioriteit</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Openstaande Betalingen</CardTitle>
            <Receipt className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvoices}</div>
            <p className="text-xs text-muted-foreground">{invoices.filter((i) => i.status === "overdue").length} achterstallig</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inkomsten & Kosten per Maand</CardTitle>
            <CardDescription>Maandelijks overzicht inkomsten vs. uitgaven</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyOverview}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: "currentColor", fontSize: 11 }} />
                  <YAxis tick={{ fill: "currentColor" }} />
                  <Tooltip
                    formatter={(value: number) => [`\u20AC${value.toLocaleString()}`, ""]}
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                  />
                  <Legend />
                  <Bar dataKey="inkomsten" fill="#22c55e" name="Inkomsten" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="kosten" fill="#ef4444" name="Kosten" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bezettingsstatus</CardTitle>
            <CardDescription>Huidige status van uw panden</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {statusData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recente Activiteit</CardTitle>
          <CardDescription>Laatste updates van uw portefeuille</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { icon: AlertCircle, color: "text-red-500", text: "Dringend: Voordeurslot klemt op Meir 78, Antwerpen", time: "2 uur geleden" },
              { icon: Clock, color: "text-orange-500", text: "Verwarmingsreparatie bezig op Naamsestraat 44, Leuven", time: "5 uur geleden" },
              { icon: Receipt, color: "text-blue-500", text: "Factuur achterstallig voor Markt Brugge - \u20AC1.310", time: "1 dag geleden" },
              { icon: CheckCircle2, color: "text-green-500", text: "Vaatwasserreparatie voltooid op Grote Markt 12, Brussel", time: "2 dagen geleden" },
              { icon: Users, color: "text-purple-500", text: "Nieuw huurcontract: Lucas Peeters op Meir 78, Antwerpen", time: "3 dagen geleden" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3">
                <activity.icon className={`size-5 ${activity.color} shrink-0`} />
                <div className="flex-1 min-w-0"><p className="text-sm truncate">{activity.text}</p></div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
