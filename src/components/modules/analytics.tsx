"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { analyticsData, properties } from "@/lib/mock-data"
import { Bot, TrendingUp, TrendingDown, Minus, Euro, Percent, Building2, Star, Calculator, MapPin } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, AreaChart, Area, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ComposedChart,
} from "recharts"

const cityPricePerSqm: Record<string, number> = {
  "Brussel": 16.5,
  "Antwerpen": 23.3,
  "Gent": 14.2,
  "Leuven": 9.7,
  "Brugge": 14.7,
  "Luik": 15.0,
  "Mechelen": 13.8,
  "Hasselt": 11.5,
  "Namen": 12.0,
  "Kortrijk": 10.5,
}

const typeMultipliers: Record<string, number> = {
  apartment: 1.0,
  studio: 0.90,
  house: 1.08,
  commercial: 1.30,
}

const typeLabels: Record<string, string> = {
  apartment: "Appartement",
  studio: "Studio",
  house: "Huis",
  commercial: "Commercieel",
}

type CalcResult = {
  estimatedRent: number
  estimatedAnnual: number
  pricePerSqm: number
  areaAvg: number
  grossYield: number | null
}


function PricingMapCard() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return
    let cancelled = false

    async function initMap() {
      const L = (await import("leaflet")).default
      if (cancelled || !mapRef.current) return

      const map = L.map(mapRef.current).setView([50.85, 4.35], 8)
      mapInstanceRef.current = map

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }).addTo(map)

      properties.forEach((property) => {
        const pricePerSqm = (property.monthlyRent / property.sqm).toFixed(1)
        const icon = L.divIcon({
          className: "",
          html: `<div style="background:white;border:1px solid #d1d5db;border-radius:6px;padding:2px 8px;font-size:11px;font-weight:600;font-family:system-ui;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.08);color:#111;">&euro;${property.monthlyRent.toLocaleString()}</div>`,
          iconSize: [80, 24],
          iconAnchor: [40, 12],
        })

        L.marker([property.lat, property.lng], { icon }).addTo(map)
          .bindPopup(`
            <div style="min-width:160px;font-family:system-ui,sans-serif;">
              <h3 style="font-weight:600;margin:0 0 4px;font-size:13px;">${property.name}</h3>
              <p style="color:#6b7280;margin:0 0 6px;font-size:11px;">${property.address}, ${property.city}</p>
              <div style="font-size:12px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:2px;"><span style="color:#6b7280;">Huur</span><span style="font-weight:600;">&euro;${property.monthlyRent.toLocaleString()}/mnd</span></div>
                <div style="display:flex;justify-content:space-between;margin-bottom:2px;"><span style="color:#6b7280;">Per m&sup2;</span><span style="font-weight:600;">&euro;${pricePerSqm}/m&sup2;</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:#6b7280;">Oppervlakte</span><span style="font-weight:600;">${property.sqm} m&sup2;</span></div>
              </div>
            </div>
          `)
      })
    }

    initMap()

    return () => {
      cancelled = true
      if (mapInstanceRef.current) {
        (mapInstanceRef.current as { remove: () => void }).remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return <div ref={mapRef} className="w-full h-[400px] rounded-lg z-0" />
}

export function AnalyticsModule() {
  const totalMonthlyRevenue = properties
    .filter((p) => p.status === "occupied")
    .reduce((s, p) => s + p.monthlyRent, 0)
  const avgOccupancy = analyticsData.occupancyRate.reduce((s, d) => s + d.rate, 0) / analyticsData.occupancyRate.length
  const totalSqm = properties.reduce((s, p) => s + p.sqm, 0)
  const avgPricePerSqm = totalMonthlyRevenue / properties.filter((p) => p.status === "occupied").reduce((s, p) => s + p.sqm, 0)

  // Yield calculator state
  const [calcCity, setCalcCity] = useState("")
  const [calcType, setCalcType] = useState("")
  const [calcSqm, setCalcSqm] = useState("")
  const [calcBedrooms, setCalcBedrooms] = useState("")
  const [calcBathrooms, setCalcBathrooms] = useState("")
  const [calcPurchasePrice, setCalcPurchasePrice] = useState("")
  const [calcResult, setCalcResult] = useState<CalcResult | null>(null)

  const handleCalculate = () => {
    const sqm = parseInt(calcSqm) || 0
    const bedrooms = parseInt(calcBedrooms) || 0
    const purchasePrice = parseInt(calcPurchasePrice) || 0
    const basePrice = cityPricePerSqm[calcCity] || 14
    const multiplier = typeMultipliers[calcType] || 1

    const estimatedRent = Math.round(basePrice * multiplier * sqm * 0.85 + bedrooms * 75)
    const estimatedAnnual = estimatedRent * 12
    const grossYield = purchasePrice > 0 ? (estimatedAnnual / purchasePrice) * 100 : null

    setCalcResult({
      estimatedRent,
      estimatedAnnual,
      pricePerSqm: sqm > 0 ? estimatedRent / sqm : 0,
      areaAvg: basePrice,
      grossYield,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Analyse</h2>
        <p className="text-muted-foreground">Marktinzichten, huurrendement en portefeuilleanalyse</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Gem. Bezetting</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Percent className="size-5 text-green-500" />
              <span className="text-2xl font-bold">{avgOccupancy.toFixed(0)}%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Portefeuillewaarde</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Euro className="size-5 text-blue-500" />
              <span className="text-2xl font-bold">&euro;{(totalMonthlyRevenue * 12).toLocaleString()}/jr</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Gem. Prijs/m&sup2;</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Building2 className="size-5 text-purple-500" />
              <span className="text-2xl font-bold">&euro;{avgPricePerSqm.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Totaal Oppervlakte</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Building2 className="size-5 text-cyan-500" />
              <span className="text-2xl font-bold">{totalSqm} m&sup2;</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rental Yield Calculator */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calculator className="size-5 text-primary" />
            <CardTitle>Huurrendement Calculator</CardTitle>
          </div>
          <CardDescription>Voer locatie en pandgegevens in voor een geschatte huurprijs en rendement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Locatie</label>
              <Select value={calcCity} onValueChange={setCalcCity}>
                <SelectTrigger><SelectValue placeholder="Selecteer stad" /></SelectTrigger>
                <SelectContent>
                  {Object.keys(cityPricePerSqm).map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Type Pand</label>
              <Select value={calcType} onValueChange={setCalcType}>
                <SelectTrigger><SelectValue placeholder="Selecteer type" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(typeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Oppervlakte (m&sup2;)</label>
              <Input
                type="number"
                placeholder="bijv. 85"
                value={calcSqm}
                onChange={(e) => setCalcSqm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Slaapkamers</label>
              <Input
                type="number"
                placeholder="bijv. 2"
                value={calcBedrooms}
                onChange={(e) => setCalcBedrooms(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Badkamers</label>
              <Input
                type="number"
                placeholder="bijv. 1"
                value={calcBathrooms}
                onChange={(e) => setCalcBathrooms(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Aankoopprijs (optioneel)</label>
              <Input
                type="number"
                placeholder="bijv. 250000"
                value={calcPurchasePrice}
                onChange={(e) => setCalcPurchasePrice(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleCalculate} disabled={!calcCity || !calcType || !calcSqm}>
            <Calculator className="size-4 mr-2" /> Bereken Rendement
          </Button>

          {/* Results */}
          {calcResult && (
            <div className="grid gap-4 md:grid-cols-4 pt-4 border-t">
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Geschatte Maandhuur</p>
                  <p className="text-xl font-bold">&euro;{calcResult.estimatedRent.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Jaarlijkse Opbrengst</p>
                  <p className="text-xl font-bold">&euro;{calcResult.estimatedAnnual.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Prijs per m&sup2;</p>
                  <p className="text-xl font-bold">&euro;{calcResult.pricePerSqm.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Gem. buurt: &euro;{calcResult.areaAvg.toFixed(2)}/m&sup2;</p>
                </CardContent>
              </Card>
              {calcResult.grossYield !== null && (
                <Card>
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground mb-1">Bruto Rendement</p>
                    <p className="text-xl font-bold">{calcResult.grossYield.toFixed(2)}%</p>
                    <p className="text-xs text-muted-foreground">
                      {calcResult.grossYield >= 5 ? "Uitstekend" : calcResult.grossYield >= 3.5 ? "Goed" : "Matig"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pricing Map */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="size-5 text-primary" />
            <CardTitle>Vastgoedprijzen op de Kaart</CardTitle>
          </div>
          <CardDescription>Uw pandprijzen per locatie</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <PricingMapCard />
        </CardContent>
      </Card>

      {/* AI Pricing Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bot className="size-5 text-primary" />
            <CardTitle>AI Prijsaanbevelingen</CardTitle>
          </div>
          <CardDescription>Gebaseerd op huurprijzen in de buurt en pandkenmerken</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.areaComparison.map((area) => {
              const diff = ((area.yourRent - area.avgRent) / area.avgRent) * 100
              const isAbove = diff > 2
              const isBelow = diff < -2
              const suggestedRent = Math.round(area.avgRent * 0.98)
              return (
                <div key={area.area} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{area.area}</p>
                    <p className="text-sm text-muted-foreground">&euro;{area.sqmPrice}/m&sup2; gebiedsgemiddelde</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">Gem. buurt: &euro;{area.avgRent.toLocaleString()}</p>
                      <p className="font-medium">Uw huur: &euro;{area.yourRent.toLocaleString()}</p>
                      {isBelow && <p className="text-green-600 text-xs font-medium">Aanbeveling: verhoog naar &euro;{suggestedRent}</p>}
                    </div>
                    {isBelow ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                        <TrendingUp className="size-3 mr-1" /> Verhogen
                      </Badge>
                    ) : isAbove ? (
                      <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/30">
                        <TrendingDown className="size-3 mr-1" /> Beoordelen
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30">
                        <Minus className="size-3 mr-1" /> Marktconform
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Uw Huur vs. Gebiedsgemiddelde</CardTitle>
            <CardDescription>Vergelijking per locatie</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.areaComparison}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="area" tick={{ fill: "currentColor", fontSize: 11 }} />
                  <YAxis tick={{ fill: "currentColor" }} />
                  <Tooltip formatter={(value: number) => [`\u20AC${value}`, ""]} />
                  <Legend />
                  <Bar dataKey="avgRent" fill="#94a3b8" name="Gebiedsgemiddelde" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="yourRent" fill="hsl(var(--primary))" name="Uw Huur" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inkomstentrend</CardTitle>
            <CardDescription>Maandelijkse inkomsten over tijd</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.revenueHistory}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: "currentColor" }} />
                  <YAxis tick={{ fill: "currentColor" }} />
                  <Tooltip formatter={(value: number) => [`\u20AC${value.toLocaleString()}`, "Inkomsten"]} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Maandelijkse Kosten</CardTitle>
            <CardDescription>Uitsplitsing per categorie</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.monthlyExpenses}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: "currentColor" }} />
                  <YAxis tick={{ fill: "currentColor" }} />
                  <Tooltip formatter={(value: number) => [`\u20AC${value}`, ""]} />
                  <Legend />
                  <Bar dataKey="onderhoud" stackId="a" fill="#f59e0b" name="Onderhoud" />
                  <Bar dataKey="verzekering" stackId="a" fill="#3b82f6" name="Verzekering" />
                  <Bar dataKey="belasting" stackId="a" fill="#8b5cf6" name="Belasting" />
                  <Bar dataKey="overig" stackId="a" fill="#6b7280" name="Overig" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Huurprijs per m&sup2;</CardTitle>
            <CardDescription>Uw panden vs. gebiedsgemiddelde</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={analyticsData.rentPerSqm}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="property" tick={{ fill: "currentColor", fontSize: 11 }} />
                  <YAxis tick={{ fill: "currentColor" }} />
                  <Tooltip formatter={(value: number) => [`\u20AC${value.toFixed(2)}/m\u00B2`, ""]} />
                  <Legend />
                  <Bar dataKey="pricePerSqm" fill="hsl(var(--primary))" name="Uw prijs/m\u00B2" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="areaAvg" stroke="#f59e0b" name="Gem. buurt/m\u00B2" strokeWidth={2} dot={{ fill: "#f59e0b" }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bezettingsgraad</CardTitle>
            <CardDescription>Percentage verhuurde panden over tijd</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.occupancyRate}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: "currentColor" }} />
                  <YAxis domain={[0, 100]} tick={{ fill: "currentColor" }} />
                  <Tooltip formatter={(value: number) => [`${value}%`, "Bezetting"]} />
                  <Line type="monotone" dataKey="rate" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="size-5 text-yellow-500" />
              <CardTitle>Huurderstevredenheid</CardTitle>
            </div>
            <CardDescription>Gemiddelde scores per categorie</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={analyticsData.tenantSatisfaction}>
                  <PolarGrid className="stroke-border" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: "currentColor", fontSize: 11 }} />
                  <PolarRadiusAxis domain={[0, 5]} tick={{ fill: "currentColor", fontSize: 10 }} />
                  <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
