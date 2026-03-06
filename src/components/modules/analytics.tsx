"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { analyticsData, properties } from "@/lib/mock-data"
import {
  Bot, TrendingUp, TrendingDown, Minus, Euro, Percent, Building2, Star,
  Calculator, MapPin, Database, BarChart3, Search, Home, ArrowUpRight, ArrowDownRight,
  Info, Target, Zap,
} from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, AreaChart, Area, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ComposedChart, Cell, PieChart, Pie,
} from "recharts"

// ── Belgian Real-Time Market Database (simulated Q1 2026) ──────────────────
type MarketEntry = {
  city: string
  region: string
  apartment: { min: number; avg: number; max: number; trend: number }
  house: { min: number; avg: number; max: number; trend: number }
  studio: { min: number; avg: number; max: number; trend: number }
  commercial: { min: number; avg: number; max: number; trend: number }
  avgPricePerSqm: number
  demandIndex: number
  vacancyRate: number
  lastUpdated: string
}

const belgianMarketDB: MarketEntry[] = [
  { city: "Brussel", region: "Brussels Hoofdstedelijk Gewest", apartment: { min: 850, avg: 1250, max: 2100, trend: 3.2 }, house: { min: 1200, avg: 1800, max: 3200, trend: 2.8 }, studio: { min: 550, avg: 780, max: 1100, trend: 4.1 }, commercial: { min: 1500, avg: 2800, max: 5500, trend: 1.5 }, avgPricePerSqm: 16.5, demandIndex: 87, vacancyRate: 3.2, lastUpdated: "2026-03-06" },
  { city: "Antwerpen", region: "Provincie Antwerpen", apartment: { min: 750, avg: 1100, max: 1900, trend: 4.5 }, house: { min: 1100, avg: 1650, max: 2800, trend: 3.9 }, studio: { min: 500, avg: 720, max: 1050, trend: 5.2 }, commercial: { min: 1200, avg: 2400, max: 4800, trend: 2.1 }, avgPricePerSqm: 23.3, demandIndex: 82, vacancyRate: 4.1, lastUpdated: "2026-03-06" },
  { city: "Gent", region: "Provincie Oost-Vlaanderen", apartment: { min: 700, avg: 1050, max: 1800, trend: 3.8 }, house: { min: 1000, avg: 1550, max: 2600, trend: 3.2 }, studio: { min: 480, avg: 680, max: 950, trend: 4.7 }, commercial: { min: 1100, avg: 2200, max: 4200, trend: 1.8 }, avgPricePerSqm: 14.2, demandIndex: 79, vacancyRate: 4.5, lastUpdated: "2026-03-06" },
  { city: "Leuven", region: "Provincie Vlaams-Brabant", apartment: { min: 650, avg: 1000, max: 1700, trend: 5.1 }, house: { min: 950, avg: 1500, max: 2500, trend: 4.2 }, studio: { min: 450, avg: 650, max: 900, trend: 6.3 }, commercial: { min: 900, avg: 1800, max: 3500, trend: 2.5 }, avgPricePerSqm: 9.7, demandIndex: 91, vacancyRate: 2.1, lastUpdated: "2026-03-06" },
  { city: "Brugge", region: "Provincie West-Vlaanderen", apartment: { min: 600, avg: 950, max: 1600, trend: 2.9 }, house: { min: 900, avg: 1400, max: 2300, trend: 2.4 }, studio: { min: 420, avg: 620, max: 880, trend: 3.5 }, commercial: { min: 800, avg: 1700, max: 3200, trend: 1.2 }, avgPricePerSqm: 14.7, demandIndex: 72, vacancyRate: 5.3, lastUpdated: "2026-03-06" },
  { city: "Luik", region: "Provincie Luik", apartment: { min: 550, avg: 850, max: 1500, trend: 2.1 }, house: { min: 800, avg: 1250, max: 2100, trend: 1.8 }, studio: { min: 380, avg: 550, max: 780, trend: 2.8 }, commercial: { min: 1000, avg: 2100, max: 4000, trend: 1.0 }, avgPricePerSqm: 15.0, demandIndex: 65, vacancyRate: 6.8, lastUpdated: "2026-03-06" },
  { city: "Mechelen", region: "Provincie Antwerpen", apartment: { min: 680, avg: 1020, max: 1650, trend: 4.8 }, house: { min: 1000, avg: 1500, max: 2400, trend: 4.1 }, studio: { min: 460, avg: 660, max: 920, trend: 5.5 }, commercial: { min: 900, avg: 1900, max: 3600, trend: 2.3 }, avgPricePerSqm: 13.8, demandIndex: 84, vacancyRate: 3.5, lastUpdated: "2026-03-06" },
  { city: "Hasselt", region: "Provincie Limburg", apartment: { min: 580, avg: 880, max: 1400, trend: 3.4 }, house: { min: 850, avg: 1300, max: 2200, trend: 2.9 }, studio: { min: 400, avg: 580, max: 820, trend: 4.0 }, commercial: { min: 750, avg: 1600, max: 3000, trend: 1.6 }, avgPricePerSqm: 11.5, demandIndex: 68, vacancyRate: 5.8, lastUpdated: "2026-03-06" },
  { city: "Namen", region: "Provincie Namen", apartment: { min: 520, avg: 800, max: 1350, trend: 2.5 }, house: { min: 780, avg: 1200, max: 2000, trend: 2.0 }, studio: { min: 360, avg: 530, max: 750, trend: 3.1 }, commercial: { min: 700, avg: 1500, max: 2800, trend: 0.8 }, avgPricePerSqm: 12.0, demandIndex: 58, vacancyRate: 7.2, lastUpdated: "2026-03-06" },
  { city: "Kortrijk", region: "Provincie West-Vlaanderen", apartment: { min: 500, avg: 780, max: 1300, trend: 3.0 }, house: { min: 750, avg: 1150, max: 1900, trend: 2.6 }, studio: { min: 350, avg: 510, max: 720, trend: 3.6 }, commercial: { min: 650, avg: 1400, max: 2600, trend: 1.1 }, avgPricePerSqm: 10.5, demandIndex: 62, vacancyRate: 6.1, lastUpdated: "2026-03-06" },
  { city: "Aalst", region: "Provincie Oost-Vlaanderen", apartment: { min: 550, avg: 830, max: 1350, trend: 3.5 }, house: { min: 800, avg: 1250, max: 2100, trend: 3.0 }, studio: { min: 380, avg: 560, max: 780, trend: 4.2 }, commercial: { min: 650, avg: 1400, max: 2700, trend: 1.4 }, avgPricePerSqm: 11.2, demandIndex: 70, vacancyRate: 5.0, lastUpdated: "2026-03-06" },
  { city: "Sint-Niklaas", region: "Provincie Oost-Vlaanderen", apartment: { min: 530, avg: 810, max: 1300, trend: 3.2 }, house: { min: 780, avg: 1200, max: 2000, trend: 2.7 }, studio: { min: 370, avg: 540, max: 760, trend: 3.9 }, commercial: { min: 600, avg: 1300, max: 2500, trend: 1.2 }, avgPricePerSqm: 10.8, demandIndex: 66, vacancyRate: 5.5, lastUpdated: "2026-03-06" },
  { city: "Oostende", region: "Provincie West-Vlaanderen", apartment: { min: 580, avg: 900, max: 1500, trend: 2.2 }, house: { min: 850, avg: 1350, max: 2200, trend: 1.9 }, studio: { min: 400, avg: 600, max: 850, trend: 2.8 }, commercial: { min: 750, avg: 1600, max: 3000, trend: 0.9 }, avgPricePerSqm: 12.5, demandIndex: 60, vacancyRate: 7.5, lastUpdated: "2026-03-06" },
  { city: "Turnhout", region: "Provincie Antwerpen", apartment: { min: 520, avg: 790, max: 1250, trend: 3.6 }, house: { min: 780, avg: 1180, max: 1950, trend: 3.1 }, studio: { min: 360, avg: 530, max: 740, trend: 4.3 }, commercial: { min: 600, avg: 1300, max: 2400, trend: 1.5 }, avgPricePerSqm: 10.2, demandIndex: 64, vacancyRate: 5.9, lastUpdated: "2026-03-06" },
  { city: "Genk", region: "Provincie Limburg", apartment: { min: 500, avg: 770, max: 1200, trend: 2.8 }, house: { min: 750, avg: 1150, max: 1900, trend: 2.3 }, studio: { min: 340, avg: 500, max: 700, trend: 3.4 }, commercial: { min: 580, avg: 1250, max: 2300, trend: 1.0 }, avgPricePerSqm: 9.8, demandIndex: 56, vacancyRate: 7.0, lastUpdated: "2026-03-06" },
]

const typeLabels: Record<string, string> = {
  apartment: "Appartement",
  studio: "Studio",
  house: "Woning",
  commercial: "Commercieel",
}

const trendHistory = [
  { quarter: "Q1 2025", brussel: 15.8, antwerpen: 22.1, gent: 13.5, leuven: 9.0 },
  { quarter: "Q2 2025", brussel: 16.0, antwerpen: 22.5, gent: 13.7, leuven: 9.2 },
  { quarter: "Q3 2025", brussel: 16.2, antwerpen: 22.8, gent: 13.9, leuven: 9.4 },
  { quarter: "Q4 2025", brussel: 16.3, antwerpen: 23.0, gent: 14.0, leuven: 9.5 },
  { quarter: "Q1 2026", brussel: 16.5, antwerpen: 23.3, gent: 14.2, leuven: 9.7 },
]

// ── Pricing Map Component ──────────────────────────────────────────────────
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

// ── Analysis Result Type ───────────────────────────────────────────────────
type AnalysisResult = {
  suggestedRent: number
  rentRange: { min: number; max: number }
  pricePerSqm: number
  marketAvgPerSqm: number
  positioning: "under" | "market" | "above"
  positioningPercent: number
  demandIndex: number
  vacancyRate: number
  trend: number
  grossYield: number | null
  comparables: { name: string; rent: number; sqm: number; type: string }[]
  advice: string[]
}

// ── Main Component ─────────────────────────────────────────────────────────
export function AnalyticsModule() {
  const totalMonthlyRevenue = properties
    .filter((p) => p.status === "occupied")
    .reduce((s, p) => s + p.monthlyRent, 0)
  const avgOccupancy = analyticsData.occupancyRate.reduce((s, d) => s + d.rate, 0) / analyticsData.occupancyRate.length
  const totalSqm = properties.reduce((s, p) => s + p.sqm, 0)
  const occupiedProps = properties.filter((p) => p.status === "occupied")
  const avgPricePerSqm = totalMonthlyRevenue / occupiedProps.reduce((s, p) => s + p.sqm, 0)

  const [analyzeCity, setAnalyzeCity] = useState("")
  const [analyzeType, setAnalyzeType] = useState("")
  const [analyzeSqm, setAnalyzeSqm] = useState("")
  const [analyzeBedrooms, setAnalyzeBedrooms] = useState("")
  const [analyzePurchasePrice, setAnalyzePurchasePrice] = useState("")
  const [analyzeCurrentRent, setAnalyzeCurrentRent] = useState("")
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      const sqm = parseInt(analyzeSqm) || 0
      const bedrooms = parseInt(analyzeBedrooms) || 0
      const purchasePrice = parseInt(analyzePurchasePrice) || 0
      const currentRent = parseInt(analyzeCurrentRent) || 0
      const market = belgianMarketDB.find((m) => m.city === analyzeCity)
      if (!market || !analyzeType) { setIsAnalyzing(false); return }

      const typeKey = analyzeType as keyof Pick<MarketEntry, "apartment" | "house" | "studio" | "commercial">
      const typeData = market[typeKey]

      const basePerSqm = market.avgPricePerSqm
      const typeMultiplier = analyzeType === "commercial" ? 1.3 : analyzeType === "house" ? 1.08 : analyzeType === "studio" ? 0.9 : 1.0
      const bedroomBonus = bedrooms * 65
      const demandAdjustment = 1 + ((market.demandIndex - 70) / 500)
      const rawRent = basePerSqm * typeMultiplier * sqm * demandAdjustment + bedroomBonus
      const suggestedRent = Math.round(rawRent / 10) * 10

      const clampedRent = Math.max(typeData.min, Math.min(typeData.max, suggestedRent))
      const pricePerSqm = sqm > 0 ? clampedRent / sqm : 0

      let positioning: "under" | "market" | "above" = "market"
      let positioningPercent = 0
      if (currentRent > 0) {
        positioningPercent = ((currentRent - typeData.avg) / typeData.avg) * 100
        if (positioningPercent < -5) positioning = "under"
        else if (positioningPercent > 5) positioning = "above"
      }

      const grossYield = purchasePrice > 0 ? (clampedRent * 12 / purchasePrice) * 100 : null

      const comparables = properties
        .filter((p) => p.city === analyzeCity || p.type === analyzeType)
        .slice(0, 3)
        .map((p) => ({ name: p.name, rent: p.monthlyRent, sqm: p.sqm, type: typeLabels[p.type] }))

      if (comparables.length < 4) {
        comparables.push({
          name: `Gem. ${typeLabels[analyzeType]} ${analyzeCity}`,
          rent: typeData.avg,
          sqm: Math.round(typeData.avg / basePerSqm),
          type: typeLabels[analyzeType],
        })
      }

      const advice: string[] = []
      if (currentRent > 0 && currentRent < clampedRent * 0.9) {
        advice.push(`Uw huidige huur ligt ${Math.round(((clampedRent - currentRent) / clampedRent) * 100)}% onder de marktwaarde. Overweeg een huurverhoging bij contractverlenging.`)
      }
      if (currentRent > 0 && currentRent > clampedRent * 1.1) {
        advice.push("Uw huur ligt boven het marktgemiddelde. Dit kan het leegstandsrisico verhogen bij huurderwissel.")
      }
      if (market.demandIndex >= 80) {
        advice.push(`Hoge vraag in ${analyzeCity} (index: ${market.demandIndex}/100). Goed moment om beschikbare panden te verhuren.`)
      }
      if (market.vacancyRate > 5) {
        advice.push(`Leegstandspercentage in ${analyzeCity} is ${market.vacancyRate}%. Overweeg een competitieve prijs om snel te verhuren.`)
      }
      if (typeData.trend > 4) {
        advice.push(`${typeLabels[analyzeType]}en in ${analyzeCity} stijgen snel (+${typeData.trend}% per jaar). Uw investering apprecieert.`)
      }
      if (grossYield !== null) {
        if (grossYield >= 5) advice.push(`Uitstekend bruto rendement van ${grossYield.toFixed(1)}%. Dit pand presteert bovengemiddeld.`)
        else if (grossYield >= 3.5) advice.push(`Goed rendement van ${grossYield.toFixed(1)}%. Conform de Belgische markt.`)
        else advice.push(`Rendement van ${grossYield.toFixed(1)}% is onder het Belgisch gemiddelde (3.5-5%). Evalueer uw aankoopprijs.`)
      }
      if (advice.length === 0) {
        advice.push("Uw pand is marktconform geprijsd. Blijf de lokale trends volgen voor optimale huurprijzen.")
      }

      setAnalysisResult({
        suggestedRent: clampedRent,
        rentRange: { min: typeData.min, max: typeData.max },
        pricePerSqm,
        marketAvgPerSqm: basePerSqm,
        positioning,
        positioningPercent,
        demandIndex: market.demandIndex,
        vacancyRate: market.vacancyRate,
        trend: typeData.trend,
        grossYield,
        comparables,
        advice,
      })
      setIsAnalyzing(false)
    }, 800)
  }

  const marketOverview = belgianMarketDB.slice(0, 10).map((m) => ({
    city: m.city,
    appartement: m.apartment.avg,
    woning: m.house.avg,
    studio: m.studio.avg,
    vraagIndex: m.demandIndex,
  }))

  const demandVsVacancy = belgianMarketDB.slice(0, 10).map((m) => ({
    city: m.city,
    vraag: m.demandIndex,
    leegstand: m.vacancyRate,
  }))

  const portfolioPositioning = properties.map((p) => {
    const market = belgianMarketDB.find((m) => m.city === p.city)
    const typeKey = p.type as keyof Pick<MarketEntry, "apartment" | "house" | "studio" | "commercial">
    const marketAvg = market ? market[typeKey].avg : 0
    const diff = marketAvg > 0 ? ((p.monthlyRent - marketAvg) / marketAvg) * 100 : 0
    return { name: p.name.split(" ")[0], huur: p.monthlyRent, markt: marketAvg, verschil: Math.round(diff) }
  })

  const typeDistribution = Object.entries(
    properties.reduce((acc, p) => { acc[p.type] = (acc[p.type] || 0) + 1; return acc }, {} as Record<string, number>)
  ).map(([type, count]) => ({ name: typeLabels[type], value: count }))
  const pieColors = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd"]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Analyse & Marktdata</h2>
        <p className="text-muted-foreground">Real-time Belgische vastgoedprijzen, huurrendement en portefeuilleanalyse</p>
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

      <Tabs defaultValue="analyze" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analyze"><Search className="size-4 mr-2" /> Pand Analyseren</TabsTrigger>
          <TabsTrigger value="market"><Database className="size-4 mr-2" /> Marktdatabank</TabsTrigger>
          <TabsTrigger value="portfolio"><BarChart3 className="size-4 mr-2" /> Portefeuille</TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Pand Analyseren ────────────────────────────────── */}
        <TabsContent value="analyze" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="size-5 text-primary" />
                <CardTitle>Pand Analyseren</CardTitle>
              </div>
              <CardDescription>Voer pandgegevens in voor een marktconforme huurprijssuggestie op basis van real-time Belgische marktdata</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stad</label>
                  <Select value={analyzeCity} onValueChange={setAnalyzeCity}>
                    <SelectTrigger><SelectValue placeholder="Selecteer stad" /></SelectTrigger>
                    <SelectContent>
                      {belgianMarketDB.map((m) => (
                        <SelectItem key={m.city} value={m.city}>{m.city} - {m.region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type Pand</label>
                  <Select value={analyzeType} onValueChange={setAnalyzeType}>
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
                  <Input type="number" placeholder="bijv. 85" value={analyzeSqm} onChange={(e) => setAnalyzeSqm(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slaapkamers</label>
                  <Input type="number" placeholder="bijv. 2" value={analyzeBedrooms} onChange={(e) => setAnalyzeBedrooms(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Huidige huurprijs (optioneel)</label>
                  <Input type="number" placeholder="bijv. 1200" value={analyzeCurrentRent} onChange={(e) => setAnalyzeCurrentRent(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Aankoopprijs (optioneel)</label>
                  <Input type="number" placeholder="bijv. 250000" value={analyzePurchasePrice} onChange={(e) => setAnalyzePurchasePrice(e.target.value)} />
                </div>
              </div>
              <Button onClick={handleAnalyze} disabled={!analyzeCity || !analyzeType || !analyzeSqm || isAnalyzing}>
                {isAnalyzing ? <><Zap className="size-4 mr-2 animate-pulse" /> Analyseren...</> : <><Calculator className="size-4 mr-2" /> Analyseer Pand</>}
              </Button>

              {analysisResult && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card className="border-primary/30 bg-primary/5">
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">Aanbevolen Huurprijs</p>
                        <p className="text-2xl font-bold text-primary">&euro;{analysisResult.suggestedRent.toLocaleString()}/mnd</p>
                        <p className="text-xs text-muted-foreground mt-1">Bereik: &euro;{analysisResult.rentRange.min} - &euro;{analysisResult.rentRange.max}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">Prijs per m&sup2;</p>
                        <p className="text-xl font-bold">&euro;{analysisResult.pricePerSqm.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground mt-1">Markt gem.: &euro;{analysisResult.marketAvgPerSqm}/m&sup2;</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-xs text-muted-foreground mb-1">Markttrend</p>
                        <div className="flex items-center gap-1">
                          <ArrowUpRight className="size-4 text-green-500" />
                          <p className="text-xl font-bold text-green-600">+{analysisResult.trend}%</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">jaarlijkse stijging</p>
                      </CardContent>
                    </Card>
                    {analysisResult.grossYield !== null && (
                      <Card>
                        <CardContent className="p-4">
                          <p className="text-xs text-muted-foreground mb-1">Bruto Rendement</p>
                          <p className="text-xl font-bold">{analysisResult.grossYield.toFixed(1)}%</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {analysisResult.grossYield >= 5 ? "Uitstekend" : analysisResult.grossYield >= 3.5 ? "Goed" : "Onder gemiddeld"}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Vraagindex</span>
                          <Badge variant={analysisResult.demandIndex >= 80 ? "default" : analysisResult.demandIndex >= 60 ? "secondary" : "outline"}>
                            {analysisResult.demandIndex >= 80 ? "Hoog" : analysisResult.demandIndex >= 60 ? "Gemiddeld" : "Laag"}
                          </Badge>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-500 transition-all" style={{ width: `${analysisResult.demandIndex}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{analysisResult.demandIndex}/100</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Leegstand</span>
                          <Badge variant={analysisResult.vacancyRate <= 3 ? "default" : analysisResult.vacancyRate <= 5 ? "secondary" : "destructive"}>
                            {analysisResult.vacancyRate <= 3 ? "Laag" : analysisResult.vacancyRate <= 5 ? "Gemiddeld" : "Hoog"}
                          </Badge>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-green-500 via-yellow-400 to-red-400 transition-all" style={{ width: `${Math.min(analysisResult.vacancyRate * 10, 100)}%` }} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{analysisResult.vacancyRate}%</p>
                      </CardContent>
                    </Card>
                    {analyzeCurrentRent && (
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Marktpositionering</span>
                            <Badge variant={analysisResult.positioning === "market" ? "secondary" : analysisResult.positioning === "under" ? "outline" : "destructive"} className={analysisResult.positioning === "under" ? "bg-green-500/10 text-green-600 border-green-500/30" : ""}>
                              {analysisResult.positioning === "under" ? "Onder markt" : analysisResult.positioning === "above" ? "Boven markt" : "Marktconform"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            {analysisResult.positioning === "under" ? <ArrowDownRight className="size-5 text-green-500" /> : analysisResult.positioning === "above" ? <ArrowUpRight className="size-5 text-red-500" /> : <Minus className="size-5 text-blue-500" />}
                            <span className="text-xl font-bold">{analysisResult.positioningPercent > 0 ? "+" : ""}{analysisResult.positioningPercent.toFixed(1)}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">vs. marktgemiddelde</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <Card className="border-primary/20">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Bot className="size-5 text-primary" />
                        <CardTitle className="text-base">AI Analyse & Advies</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysisResult.advice.map((tip, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Info className="size-4 text-primary mt-0.5 shrink-0" />
                            <p className="text-sm">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Vergelijkbare Panden</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 md:grid-cols-2">
                        {analysisResult.comparables.map((comp, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                            <div>
                              <p className="font-medium text-sm">{comp.name}</p>
                              <p className="text-xs text-muted-foreground">{comp.type} - {comp.sqm} m&sup2;</p>
                            </div>
                            <p className="font-semibold">&euro;{comp.rent.toLocaleString()}/mnd</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab 2: Marktdatabank ──────────────────────────────────── */}
        <TabsContent value="market" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="size-5 text-primary" />
                <CardTitle>Belgische Vastgoedprijzen Databank</CardTitle>
              </div>
              <CardDescription>Real-time huurprijzen per stad, type en trends - Laatste update: 6 maart 2026</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium">Stad</th>
                      <th className="text-right py-3 px-2 font-medium">Appartement</th>
                      <th className="text-right py-3 px-2 font-medium">Woning</th>
                      <th className="text-right py-3 px-2 font-medium">Studio</th>
                      <th className="text-right py-3 px-2 font-medium">&euro;/m&sup2;</th>
                      <th className="text-right py-3 px-2 font-medium">Vraag</th>
                      <th className="text-right py-3 px-2 font-medium">Leegstand</th>
                    </tr>
                  </thead>
                  <tbody>
                    {belgianMarketDB.slice(0, 10).map((m) => (
                      <tr key={m.city} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-2.5 px-2">
                          <div>
                            <p className="font-medium">{m.city}</p>
                            <p className="text-xs text-muted-foreground">{m.region}</p>
                          </div>
                        </td>
                        <td className="text-right py-2.5 px-2">
                          <span className="font-medium">&euro;{m.apartment.avg}</span>
                          <span className="text-xs text-green-600 ml-1">+{m.apartment.trend}%</span>
                        </td>
                        <td className="text-right py-2.5 px-2">
                          <span className="font-medium">&euro;{m.house.avg}</span>
                          <span className="text-xs text-green-600 ml-1">+{m.house.trend}%</span>
                        </td>
                        <td className="text-right py-2.5 px-2">
                          <span className="font-medium">&euro;{m.studio.avg}</span>
                          <span className="text-xs text-green-600 ml-1">+{m.studio.trend}%</span>
                        </td>
                        <td className="text-right py-2.5 px-2 font-medium">&euro;{m.avgPricePerSqm}</td>
                        <td className="text-right py-2.5 px-2">
                          <Badge variant={m.demandIndex >= 80 ? "default" : m.demandIndex >= 60 ? "secondary" : "outline"} className="text-[10px]">
                            {m.demandIndex}
                          </Badge>
                        </td>
                        <td className="text-right py-2.5 px-2">
                          <span className={m.vacancyRate <= 3 ? "text-green-600" : m.vacancyRate <= 5 ? "text-yellow-600" : "text-red-600"}>
                            {m.vacancyRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Gemiddelde Huurprijzen per Stad</CardTitle>
                <CardDescription>Appartement, woning en studio vergelijking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={marketOverview} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" tick={{ fill: "currentColor", fontSize: 11 }} />
                      <YAxis dataKey="city" type="category" tick={{ fill: "currentColor", fontSize: 11 }} width={80} />
                      <Tooltip formatter={(value: number) => [`\u20AC${value}`, ""]} />
                      <Legend />
                      <Bar dataKey="appartement" fill="#6366f1" name="Appartement" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="woning" fill="#8b5cf6" name="Woning" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="studio" fill="#a78bfa" name="Studio" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prijstrend per m&sup2;</CardTitle>
                <CardDescription>Evolutie Q1 2025 - Q1 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendHistory}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="quarter" tick={{ fill: "currentColor", fontSize: 11 }} />
                      <YAxis tick={{ fill: "currentColor" }} />
                      <Tooltip formatter={(value: number) => [`\u20AC${value}/m\u00B2`, ""]} />
                      <Legend />
                      <Line type="monotone" dataKey="brussel" stroke="#6366f1" name="Brussel" strokeWidth={2} dot={{ fill: "#6366f1" }} />
                      <Line type="monotone" dataKey="antwerpen" stroke="#8b5cf6" name="Antwerpen" strokeWidth={2} dot={{ fill: "#8b5cf6" }} />
                      <Line type="monotone" dataKey="gent" stroke="#a78bfa" name="Gent" strokeWidth={2} dot={{ fill: "#a78bfa" }} />
                      <Line type="monotone" dataKey="leuven" stroke="#c4b5fd" name="Leuven" strokeWidth={2} dot={{ fill: "#c4b5fd" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Vraag vs. Leegstand</CardTitle>
                <CardDescription>Verhouding per stad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={demandVsVacancy}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="city" tick={{ fill: "currentColor", fontSize: 10 }} />
                      <YAxis yAxisId="left" tick={{ fill: "currentColor" }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fill: "currentColor" }} />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="vraag" fill="#6366f1" name="Vraagindex" radius={[4, 4, 0, 0]} />
                      <Line yAxisId="right" type="monotone" dataKey="leegstand" stroke="#f59e0b" name="Leegstand %" strokeWidth={2} dot={{ fill: "#f59e0b" }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MapPin className="size-5 text-primary" />
                  <CardTitle>Prijzenkaart</CardTitle>
                </div>
                <CardDescription>Uw pandprijzen op de kaart</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <PricingMapCard />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Tab 3: Portefeuille ───────────────────────────────────── */}
        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bot className="size-5 text-primary" />
                <CardTitle>AI Prijsaanbevelingen</CardTitle>
              </div>
              <CardDescription>Uw panden vergeleken met real-time marktdata</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {properties.map((property) => {
                  const market = belgianMarketDB.find((m) => m.city === property.city)
                  const typeKey = property.type as keyof Pick<MarketEntry, "apartment" | "house" | "studio" | "commercial">
                  const marketAvg = market ? market[typeKey].avg : 0
                  const diff = marketAvg > 0 ? ((property.monthlyRent - marketAvg) / marketAvg) * 100 : 0
                  const trend = market ? market[typeKey].trend : 0
                  const isAbove = diff > 5
                  const isBelow = diff < -5

                  return (
                    <div key={property.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <Home className="size-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{property.name}</p>
                          <p className="text-sm text-muted-foreground">{property.city} - {typeLabels[property.type]} - {property.sqm}m&sup2;</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm">
                          <p className="text-muted-foreground">Markt: &euro;{marketAvg.toLocaleString()}/mnd</p>
                          <p className="font-medium">Uw huur: &euro;{property.monthlyRent.toLocaleString()}/mnd</p>
                          {isBelow && <p className="text-green-600 text-xs font-medium">Verhoog naar &euro;{Math.round(marketAvg * 0.98)}/mnd (+{Math.abs(Math.round(diff))}%)</p>}
                          {isAbove && <p className="text-orange-600 text-xs font-medium">{Math.round(diff)}% boven markt - monitor leegstandrisico</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-green-600">+{trend}%/jr</span>
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
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Uw Huur vs. Marktgemiddelde</CardTitle>
                <CardDescription>Positionering per pand</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={portfolioPositioning}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="name" tick={{ fill: "currentColor", fontSize: 11 }} />
                      <YAxis tick={{ fill: "currentColor" }} />
                      <Tooltip formatter={(value: number) => [`\u20AC${value}`, ""]} />
                      <Legend />
                      <Bar dataKey="huur" fill="hsl(var(--primary))" name="Uw Huur" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="markt" fill="#94a3b8" name="Marktgemiddelde" radius={[4, 4, 0, 0]} />
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
                <CardTitle>Type Verdeling</CardTitle>
                <CardDescription>Portefeuille samenstelling</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={typeDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name} (${value})`}>
                        {typeDistribution.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
