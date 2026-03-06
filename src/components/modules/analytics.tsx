"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { analyticsData, properties } from "@/lib/mock-data"
import {
  Bot, TrendingUp, TrendingDown, Minus, Euro, Percent, Building2, Star,
  Calculator, MapPin, Database, BarChart3, Search, Home, ArrowUpRight, ArrowDownRight,
  Info, Target, Zap, Bed, Ruler, Navigation,
} from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, AreaChart, Area, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ComposedChart, Cell, PieChart, Pie,
} from "recharts"

// ── Belgian Market Database (simulated Q1 2026) ─────────────────────────────
// Extended with sale prices per sqm
type MarketEntry = {
  city: string
  region: string
  zipCodes: string[]
  lat: number
  lng: number
  apartment: { rentMin: number; rentAvg: number; rentMax: number; rentTrend: number; saleMin: number; saleAvg: number; saleMax: number; saleTrend: number }
  house: { rentMin: number; rentAvg: number; rentMax: number; rentTrend: number; saleMin: number; saleAvg: number; saleMax: number; saleTrend: number }
  studio: { rentMin: number; rentAvg: number; rentMax: number; rentTrend: number; saleMin: number; saleAvg: number; saleMax: number; saleTrend: number }
  commercial: { rentMin: number; rentAvg: number; rentMax: number; rentTrend: number; saleMin: number; saleAvg: number; saleMax: number; saleTrend: number }
  avgRentPerSqm: number
  avgSalePerSqm: number
  demandIndex: number
  vacancyRate: number
  lastUpdated: string
}

const belgianMarketDB: MarketEntry[] = [
  { city: "Brussel", region: "Brussels Hoofdstedelijk Gewest", zipCodes: ["1000","1010","1020","1030","1040","1050","1060","1070","1080","1081","1082","1083","1090","1140","1150","1160","1170","1180","1190","1200","1210"], lat: 50.8503, lng: 4.3517,
    apartment: { rentMin: 850, rentAvg: 1250, rentMax: 2100, rentTrend: 3.2, saleMin: 2200, saleAvg: 3400, saleMax: 5800, saleTrend: 2.8 },
    house: { rentMin: 1200, rentAvg: 1800, rentMax: 3200, rentTrend: 2.8, saleMin: 2800, saleAvg: 4200, saleMax: 7500, saleTrend: 3.1 },
    studio: { rentMin: 550, rentAvg: 780, rentMax: 1100, rentTrend: 4.1, saleMin: 2600, saleAvg: 3800, saleMax: 5200, saleTrend: 3.5 },
    commercial: { rentMin: 1500, rentAvg: 2800, rentMax: 5500, rentTrend: 1.5, saleMin: 1800, saleAvg: 3200, saleMax: 6000, saleTrend: 1.2 },
    avgRentPerSqm: 16.5, avgSalePerSqm: 3400, demandIndex: 87, vacancyRate: 3.2, lastUpdated: "2026-03-06" },
  { city: "Antwerpen", region: "Provincie Antwerpen", zipCodes: ["2000","2018","2020","2030","2040","2050","2060","2100","2140","2150","2160","2170","2180","2600","2610","2660"], lat: 51.2194, lng: 4.4025,
    apartment: { rentMin: 750, rentAvg: 1100, rentMax: 1900, rentTrend: 4.5, saleMin: 2000, saleAvg: 3100, saleMax: 5200, saleTrend: 3.8 },
    house: { rentMin: 1100, rentAvg: 1650, rentMax: 2800, rentTrend: 3.9, saleMin: 2400, saleAvg: 3800, saleMax: 6500, saleTrend: 3.5 },
    studio: { rentMin: 500, rentAvg: 720, rentMax: 1050, rentTrend: 5.2, saleMin: 2300, saleAvg: 3500, saleMax: 4800, saleTrend: 4.1 },
    commercial: { rentMin: 1200, rentAvg: 2400, rentMax: 4800, rentTrend: 2.1, saleMin: 1600, saleAvg: 2800, saleMax: 5200, saleTrend: 1.8 },
    avgRentPerSqm: 14.8, avgSalePerSqm: 3100, demandIndex: 82, vacancyRate: 4.1, lastUpdated: "2026-03-06" },
  { city: "Gent", region: "Provincie Oost-Vlaanderen", zipCodes: ["9000","9030","9031","9032","9040","9041","9042","9050","9051","9052"], lat: 51.0543, lng: 3.7174,
    apartment: { rentMin: 700, rentAvg: 1050, rentMax: 1800, rentTrend: 3.8, saleMin: 1900, saleAvg: 2950, saleMax: 4800, saleTrend: 3.2 },
    house: { rentMin: 1000, rentAvg: 1550, rentMax: 2600, rentTrend: 3.2, saleMin: 2200, saleAvg: 3500, saleMax: 6000, saleTrend: 2.9 },
    studio: { rentMin: 480, rentAvg: 680, rentMax: 950, rentTrend: 4.7, saleMin: 2100, saleAvg: 3200, saleMax: 4500, saleTrend: 3.8 },
    commercial: { rentMin: 1100, rentAvg: 2200, rentMax: 4200, rentTrend: 1.8, saleMin: 1500, saleAvg: 2600, saleMax: 4800, saleTrend: 1.5 },
    avgRentPerSqm: 14.2, avgSalePerSqm: 2950, demandIndex: 79, vacancyRate: 4.5, lastUpdated: "2026-03-06" },
  { city: "Leuven", region: "Provincie Vlaams-Brabant", zipCodes: ["3000","3001","3010","3012","3018","3020","3040","3050","3060","3070","3078"], lat: 50.8798, lng: 4.7005,
    apartment: { rentMin: 650, rentAvg: 1000, rentMax: 1700, rentTrend: 5.1, saleMin: 2100, saleAvg: 3300, saleMax: 5500, saleTrend: 4.2 },
    house: { rentMin: 950, rentAvg: 1500, rentMax: 2500, rentTrend: 4.2, saleMin: 2500, saleAvg: 3900, saleMax: 6800, saleTrend: 3.8 },
    studio: { rentMin: 450, rentAvg: 650, rentMax: 900, rentTrend: 6.3, saleMin: 2400, saleAvg: 3600, saleMax: 5000, saleTrend: 5.0 },
    commercial: { rentMin: 900, rentAvg: 1800, rentMax: 3500, rentTrend: 2.5, saleMin: 1400, saleAvg: 2500, saleMax: 4500, saleTrend: 2.0 },
    avgRentPerSqm: 13.5, avgSalePerSqm: 3300, demandIndex: 91, vacancyRate: 2.1, lastUpdated: "2026-03-06" },
  { city: "Brugge", region: "Provincie West-Vlaanderen", zipCodes: ["8000","8200","8210","8300","8310"], lat: 51.2093, lng: 3.2247,
    apartment: { rentMin: 600, rentAvg: 950, rentMax: 1600, rentTrend: 2.9, saleMin: 1700, saleAvg: 2700, saleMax: 4500, saleTrend: 2.5 },
    house: { rentMin: 900, rentAvg: 1400, rentMax: 2300, rentTrend: 2.4, saleMin: 2000, saleAvg: 3200, saleMax: 5500, saleTrend: 2.2 },
    studio: { rentMin: 420, rentAvg: 620, rentMax: 880, rentTrend: 3.5, saleMin: 1900, saleAvg: 2900, saleMax: 4100, saleTrend: 3.0 },
    commercial: { rentMin: 800, rentAvg: 1700, rentMax: 3200, rentTrend: 1.2, saleMin: 1300, saleAvg: 2200, saleMax: 4000, saleTrend: 1.0 },
    avgRentPerSqm: 12.8, avgSalePerSqm: 2700, demandIndex: 72, vacancyRate: 5.3, lastUpdated: "2026-03-06" },
  { city: "Luik", region: "Provincie Luik", zipCodes: ["4000","4020","4030","4031","4032","4040","4050","4100","4120"], lat: 50.6326, lng: 5.5797,
    apartment: { rentMin: 550, rentAvg: 850, rentMax: 1500, rentTrend: 2.1, saleMin: 1200, saleAvg: 1950, saleMax: 3200, saleTrend: 1.8 },
    house: { rentMin: 800, rentAvg: 1250, rentMax: 2100, rentTrend: 1.8, saleMin: 1500, saleAvg: 2400, saleMax: 4000, saleTrend: 1.5 },
    studio: { rentMin: 380, rentAvg: 550, rentMax: 780, rentTrend: 2.8, saleMin: 1400, saleAvg: 2100, saleMax: 3000, saleTrend: 2.2 },
    commercial: { rentMin: 1000, rentAvg: 2100, rentMax: 4000, rentTrend: 1.0, saleMin: 1100, saleAvg: 1900, saleMax: 3500, saleTrend: 0.8 },
    avgRentPerSqm: 11.2, avgSalePerSqm: 1950, demandIndex: 65, vacancyRate: 6.8, lastUpdated: "2026-03-06" },
  { city: "Mechelen", region: "Provincie Antwerpen", zipCodes: ["2800","2801","2811","2812"], lat: 51.0259, lng: 4.4777,
    apartment: { rentMin: 680, rentAvg: 1020, rentMax: 1650, rentTrend: 4.8, saleMin: 1900, saleAvg: 2900, saleMax: 4600, saleTrend: 4.0 },
    house: { rentMin: 1000, rentAvg: 1500, rentMax: 2400, rentTrend: 4.1, saleMin: 2200, saleAvg: 3500, saleMax: 5800, saleTrend: 3.6 },
    studio: { rentMin: 460, rentAvg: 660, rentMax: 920, rentTrend: 5.5, saleMin: 2100, saleAvg: 3100, saleMax: 4300, saleTrend: 4.5 },
    commercial: { rentMin: 900, rentAvg: 1900, rentMax: 3600, rentTrend: 2.3, saleMin: 1400, saleAvg: 2500, saleMax: 4200, saleTrend: 1.9 },
    avgRentPerSqm: 13.8, avgSalePerSqm: 2900, demandIndex: 84, vacancyRate: 3.5, lastUpdated: "2026-03-06" },
  { city: "Hasselt", region: "Provincie Limburg", zipCodes: ["3500","3510","3511","3512"], lat: 50.9307, lng: 5.3325,
    apartment: { rentMin: 580, rentAvg: 880, rentMax: 1400, rentTrend: 3.4, saleMin: 1500, saleAvg: 2400, saleMax: 3800, saleTrend: 2.9 },
    house: { rentMin: 850, rentAvg: 1300, rentMax: 2200, rentTrend: 2.9, saleMin: 1800, saleAvg: 2800, saleMax: 4500, saleTrend: 2.5 },
    studio: { rentMin: 400, rentAvg: 580, rentMax: 820, rentTrend: 4.0, saleMin: 1700, saleAvg: 2500, saleMax: 3500, saleTrend: 3.2 },
    commercial: { rentMin: 750, rentAvg: 1600, rentMax: 3000, rentTrend: 1.6, saleMin: 1100, saleAvg: 2000, saleMax: 3500, saleTrend: 1.3 },
    avgRentPerSqm: 11.5, avgSalePerSqm: 2400, demandIndex: 68, vacancyRate: 5.8, lastUpdated: "2026-03-06" },
  { city: "Namen", region: "Provincie Namen", zipCodes: ["5000","5002","5003","5004","5020","5021","5022","5024"], lat: 50.4674, lng: 4.8720,
    apartment: { rentMin: 520, rentAvg: 800, rentMax: 1350, rentTrend: 2.5, saleMin: 1300, saleAvg: 2100, saleMax: 3500, saleTrend: 2.0 },
    house: { rentMin: 780, rentAvg: 1200, rentMax: 2000, rentTrend: 2.0, saleMin: 1600, saleAvg: 2500, saleMax: 4200, saleTrend: 1.8 },
    studio: { rentMin: 360, rentAvg: 530, rentMax: 750, rentTrend: 3.1, saleMin: 1500, saleAvg: 2200, saleMax: 3100, saleTrend: 2.5 },
    commercial: { rentMin: 700, rentAvg: 1500, rentMax: 2800, rentTrend: 0.8, saleMin: 1000, saleAvg: 1800, saleMax: 3200, saleTrend: 0.6 },
    avgRentPerSqm: 10.8, avgSalePerSqm: 2100, demandIndex: 58, vacancyRate: 7.2, lastUpdated: "2026-03-06" },
  { city: "Kortrijk", region: "Provincie West-Vlaanderen", zipCodes: ["8500","8501","8510","8511"], lat: 50.8279, lng: 3.2648,
    apartment: { rentMin: 500, rentAvg: 780, rentMax: 1300, rentTrend: 3.0, saleMin: 1400, saleAvg: 2200, saleMax: 3600, saleTrend: 2.6 },
    house: { rentMin: 750, rentAvg: 1150, rentMax: 1900, rentTrend: 2.6, saleMin: 1700, saleAvg: 2700, saleMax: 4500, saleTrend: 2.3 },
    studio: { rentMin: 350, rentAvg: 510, rentMax: 720, rentTrend: 3.6, saleMin: 1500, saleAvg: 2300, saleMax: 3200, saleTrend: 2.9 },
    commercial: { rentMin: 650, rentAvg: 1400, rentMax: 2600, rentTrend: 1.1, saleMin: 1000, saleAvg: 1800, saleMax: 3000, saleTrend: 0.9 },
    avgRentPerSqm: 10.5, avgSalePerSqm: 2200, demandIndex: 62, vacancyRate: 6.1, lastUpdated: "2026-03-06" },
  { city: "Aalst", region: "Provincie Oost-Vlaanderen", zipCodes: ["9300","9308","9310","9320"], lat: 50.9384, lng: 4.0393,
    apartment: { rentMin: 550, rentAvg: 830, rentMax: 1350, rentTrend: 3.5, saleMin: 1500, saleAvg: 2350, saleMax: 3800, saleTrend: 3.0 },
    house: { rentMin: 800, rentAvg: 1250, rentMax: 2100, rentTrend: 3.0, saleMin: 1800, saleAvg: 2800, saleMax: 4600, saleTrend: 2.7 },
    studio: { rentMin: 380, rentAvg: 560, rentMax: 780, rentTrend: 4.2, saleMin: 1600, saleAvg: 2400, saleMax: 3400, saleTrend: 3.4 },
    commercial: { rentMin: 650, rentAvg: 1400, rentMax: 2700, rentTrend: 1.4, saleMin: 1100, saleAvg: 1900, saleMax: 3300, saleTrend: 1.1 },
    avgRentPerSqm: 11.2, avgSalePerSqm: 2350, demandIndex: 70, vacancyRate: 5.0, lastUpdated: "2026-03-06" },
  { city: "Sint-Niklaas", region: "Provincie Oost-Vlaanderen", zipCodes: ["9100","9111","9112"], lat: 51.1565, lng: 4.1434,
    apartment: { rentMin: 530, rentAvg: 810, rentMax: 1300, rentTrend: 3.2, saleMin: 1400, saleAvg: 2250, saleMax: 3600, saleTrend: 2.8 },
    house: { rentMin: 780, rentAvg: 1200, rentMax: 2000, rentTrend: 2.7, saleMin: 1700, saleAvg: 2650, saleMax: 4400, saleTrend: 2.5 },
    studio: { rentMin: 370, rentAvg: 540, rentMax: 760, rentTrend: 3.9, saleMin: 1500, saleAvg: 2300, saleMax: 3200, saleTrend: 3.2 },
    commercial: { rentMin: 600, rentAvg: 1300, rentMax: 2500, rentTrend: 1.2, saleMin: 1000, saleAvg: 1800, saleMax: 3100, saleTrend: 1.0 },
    avgRentPerSqm: 10.8, avgSalePerSqm: 2250, demandIndex: 66, vacancyRate: 5.5, lastUpdated: "2026-03-06" },
  { city: "Oostende", region: "Provincie West-Vlaanderen", zipCodes: ["8400","8401","8420"], lat: 51.2254, lng: 2.9263,
    apartment: { rentMin: 580, rentAvg: 900, rentMax: 1500, rentTrend: 2.2, saleMin: 1600, saleAvg: 2500, saleMax: 4200, saleTrend: 1.9 },
    house: { rentMin: 850, rentAvg: 1350, rentMax: 2200, rentTrend: 1.9, saleMin: 1900, saleAvg: 3000, saleMax: 5000, saleTrend: 1.7 },
    studio: { rentMin: 400, rentAvg: 600, rentMax: 850, rentTrend: 2.8, saleMin: 1800, saleAvg: 2700, saleMax: 3800, saleTrend: 2.2 },
    commercial: { rentMin: 750, rentAvg: 1600, rentMax: 3000, rentTrend: 0.9, saleMin: 1200, saleAvg: 2100, saleMax: 3600, saleTrend: 0.7 },
    avgRentPerSqm: 12.0, avgSalePerSqm: 2500, demandIndex: 60, vacancyRate: 7.5, lastUpdated: "2026-03-06" },
  { city: "Turnhout", region: "Provincie Antwerpen", zipCodes: ["2300","2310","2340"], lat: 51.3224, lng: 4.9441,
    apartment: { rentMin: 520, rentAvg: 790, rentMax: 1250, rentTrend: 3.6, saleMin: 1400, saleAvg: 2200, saleMax: 3500, saleTrend: 3.1 },
    house: { rentMin: 780, rentAvg: 1180, rentMax: 1950, rentTrend: 3.1, saleMin: 1600, saleAvg: 2600, saleMax: 4200, saleTrend: 2.8 },
    studio: { rentMin: 360, rentAvg: 530, rentMax: 740, rentTrend: 4.3, saleMin: 1500, saleAvg: 2300, saleMax: 3200, saleTrend: 3.5 },
    commercial: { rentMin: 600, rentAvg: 1300, rentMax: 2400, rentTrend: 1.5, saleMin: 1000, saleAvg: 1800, saleMax: 3000, saleTrend: 1.2 },
    avgRentPerSqm: 10.2, avgSalePerSqm: 2200, demandIndex: 64, vacancyRate: 5.9, lastUpdated: "2026-03-06" },
  { city: "Genk", region: "Provincie Limburg", zipCodes: ["3600","3620","3630"], lat: 50.9653, lng: 5.5014,
    apartment: { rentMin: 500, rentAvg: 770, rentMax: 1200, rentTrend: 2.8, saleMin: 1300, saleAvg: 2050, saleMax: 3300, saleTrend: 2.4 },
    house: { rentMin: 750, rentAvg: 1150, rentMax: 1900, rentTrend: 2.3, saleMin: 1500, saleAvg: 2400, saleMax: 3900, saleTrend: 2.1 },
    studio: { rentMin: 340, rentAvg: 500, rentMax: 700, rentTrend: 3.4, saleMin: 1400, saleAvg: 2100, saleMax: 3000, saleTrend: 2.8 },
    commercial: { rentMin: 580, rentAvg: 1250, rentMax: 2300, rentTrend: 1.0, saleMin: 900, saleAvg: 1600, saleMax: 2800, saleTrend: 0.8 },
    avgRentPerSqm: 9.8, avgSalePerSqm: 2050, demandIndex: 56, vacancyRate: 7.0, lastUpdated: "2026-03-06" },
]

const typeLabels: Record<string, string> = {
  apartment: "Appartement",
  studio: "Studio",
  house: "Woning",
  commercial: "Commercieel",
}

const trendHistory = [
  { quarter: "Q1 2025", brussel: 3200, antwerpen: 2900, gent: 2750, leuven: 3100 },
  { quarter: "Q2 2025", brussel: 3250, antwerpen: 2950, gent: 2800, leuven: 3150 },
  { quarter: "Q3 2025", brussel: 3300, antwerpen: 3000, gent: 2850, leuven: 3200 },
  { quarter: "Q4 2025", brussel: 3350, antwerpen: 3050, gent: 2900, leuven: 3250 },
  { quarter: "Q1 2026", brussel: 3400, antwerpen: 3100, gent: 2950, leuven: 3300 },
]

// ── Nearby Comparables Map ──────────────────────────────────────────────────
function NearbyPricesMap({ centerLat, centerLng, nearbyProps, analyzedPrice }: {
  centerLat: number
  centerLng: number
  nearbyProps: { name: string; lat: number; lng: number; rent: number; saleEst: number; sqm: number; type: string }[]
  analyzedPrice: number
}) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return
    let cancelled = false

    async function initMap() {
      const L = (await import("leaflet")).default
      if (cancelled || !mapRef.current) return

      const map = L.map(mapRef.current).setView([centerLat, centerLng], 13)
      mapInstanceRef.current = map

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }).addTo(map)

      // Center marker (analyzed location)
      const centerIcon = L.divIcon({
        className: "",
        html: `<div style="background:#6366f1;color:white;border-radius:8px;padding:3px 10px;font-size:12px;font-weight:700;font-family:system-ui;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.2);border:2px solid white;">&euro;${analyzedPrice.toLocaleString()}/mnd</div>`,
        iconSize: [100, 28],
        iconAnchor: [50, 14],
      })
      L.marker([centerLat, centerLng], { icon: centerIcon }).addTo(map)
        .bindPopup(`<div style="font-family:system-ui;"><strong>Uw analyse</strong><br/>&euro;${analyzedPrice.toLocaleString()}/mnd</div>`)

      // Nearby properties
      nearbyProps.forEach((p) => {
        const icon = L.divIcon({
          className: "",
          html: `<div style="background:white;border:1.5px solid #d1d5db;border-radius:6px;padding:2px 8px;font-size:11px;font-weight:600;font-family:system-ui;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.08);color:#111;">&euro;${p.rent.toLocaleString()}</div>`,
          iconSize: [80, 24],
          iconAnchor: [40, 12],
        })
        L.marker([p.lat, p.lng], { icon }).addTo(map)
          .bindPopup(`
            <div style="min-width:160px;font-family:system-ui,sans-serif;">
              <h3 style="font-weight:600;margin:0 0 4px;font-size:13px;">${p.name}</h3>
              <div style="font-size:12px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:2px;"><span style="color:#6b7280;">Huur</span><span style="font-weight:600;">&euro;${p.rent.toLocaleString()}/mnd</span></div>
                <div style="display:flex;justify-content:space-between;margin-bottom:2px;"><span style="color:#6b7280;">Geschatte waarde</span><span style="font-weight:600;">&euro;${p.saleEst.toLocaleString()}</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:#6b7280;">Oppervlakte</span><span style="font-weight:600;">${p.sqm} m&sup2;</span></div>
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
  }, [centerLat, centerLng, nearbyProps, analyzedPrice])

  return <div ref={mapRef} className="w-full h-[400px] rounded-lg z-0" />
}

// ── Market Overview Map ─────────────────────────────────────────────────────
function MarketOverviewMap() {
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

      // Show all portfolio properties with prices
      properties.forEach((property) => {
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
                <div style="display:flex;justify-content:space-between;margin-bottom:2px;"><span style="color:#6b7280;">Per m&sup2;</span><span style="font-weight:600;">&euro;${(property.monthlyRent / property.sqm).toFixed(1)}/m&sup2;</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:#6b7280;">Oppervlakte</span><span style="font-weight:600;">${property.sqm} m&sup2;</span></div>
              </div>
            </div>
          `)
      })

      // Show market cities with avg sale price
      belgianMarketDB.forEach((m) => {
        const icon = L.divIcon({
          className: "",
          html: `<div style="background:#6366f1;color:white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;font-family:system-ui;box-shadow:0 2px 6px rgba(0,0,0,0.2);border:2px solid white;">${(m.avgSalePerSqm / 1000).toFixed(1)}k</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        })
        L.marker([m.lat, m.lng], { icon }).addTo(map)
          .bindPopup(`
            <div style="min-width:180px;font-family:system-ui,sans-serif;">
              <h3 style="font-weight:600;margin:0 0 2px;font-size:14px;">${m.city}</h3>
              <p style="color:#6b7280;margin:0 0 8px;font-size:11px;">${m.region}</p>
              <div style="font-size:12px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:3px;"><span style="color:#6b7280;">Gem. verkoopprijs/m&sup2;</span><span style="font-weight:600;">&euro;${m.avgSalePerSqm.toLocaleString()}</span></div>
                <div style="display:flex;justify-content:space-between;margin-bottom:3px;"><span style="color:#6b7280;">Gem. huur/m&sup2;</span><span style="font-weight:600;">&euro;${m.avgRentPerSqm}</span></div>
                <div style="display:flex;justify-content:space-between;margin-bottom:3px;"><span style="color:#6b7280;">Vraagindex</span><span style="font-weight:600;">${m.demandIndex}/100</span></div>
                <div style="display:flex;justify-content:space-between;"><span style="color:#6b7280;">Leegstand</span><span style="font-weight:600;">${m.vacancyRate}%</span></div>
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

// ── Analysis Result Type ────────────────────────────────────────────────────
type AnalysisResult = {
  city: string
  matchedMarket: MarketEntry
  suggestedRent: number
  rentRange: { min: number; max: number }
  suggestedSalePrice: number
  saleRange: { min: number; max: number }
  rentPerSqm: number
  salePerSqm: number
  marketAvgRentPerSqm: number
  marketAvgSalePerSqm: number
  positioning: "under" | "market" | "above"
  positioningPercent: number
  demandIndex: number
  vacancyRate: number
  rentTrend: number
  saleTrend: number
  grossYield: number | null
  nearbyProps: { name: string; lat: number; lng: number; rent: number; saleEst: number; sqm: number; type: string }[]
  advice: string[]
}

// ── Main Component ──────────────────────────────────────────────────────────
export function AnalyticsModule() {
  const totalMonthlyRevenue = properties.filter((p) => p.status === "occupied").reduce((s, p) => s + p.monthlyRent, 0)
  const avgOccupancy = analyticsData.occupancyRate.reduce((s, d) => s + d.rate, 0) / analyticsData.occupancyRate.length
  const totalSqm = properties.reduce((s, p) => s + p.sqm, 0)
  const occupiedProps = properties.filter((p) => p.status === "occupied")
  const avgPricePerSqm = totalMonthlyRevenue / occupiedProps.reduce((s, p) => s + p.sqm, 0)

  // Analysis form - free text inputs
  const [analyzeAddress, setAnalyzeAddress] = useState("")
  const [analyzeCity, setAnalyzeCity] = useState("")
  const [analyzeZip, setAnalyzeZip] = useState("")
  const [analyzeType, setAnalyzeType] = useState("")
  const [analyzeSqm, setAnalyzeSqm] = useState("")
  const [analyzeBedrooms, setAnalyzeBedrooms] = useState("")
  const [analyzePurchasePrice, setAnalyzePurchasePrice] = useState("")
  const [analyzeCurrentRent, setAnalyzeCurrentRent] = useState("")
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const findClosestMarket = (city: string, zip: string): MarketEntry | null => {
    const cityLower = city.toLowerCase().trim()
    // Try exact city match first
    const exact = belgianMarketDB.find((m) => m.city.toLowerCase() === cityLower)
    if (exact) return exact
    // Try partial city match
    const partial = belgianMarketDB.find((m) => m.city.toLowerCase().includes(cityLower) || cityLower.includes(m.city.toLowerCase()))
    if (partial) return partial
    // Try zip code match
    if (zip) {
      const zipMatch = belgianMarketDB.find((m) => m.zipCodes.some((z) => zip.startsWith(z.slice(0, 2))))
      if (zipMatch) return zipMatch
    }
    // Fallback: find nearest by region keywords
    const regionKeywords: Record<string, string[]> = {
      "Brussel": ["brussel", "bruxelles", "etterbeek", "ixelles", "elsene", "schaarbeek", "jette", "anderlecht", "molenbeek", "ukkel", "vorst", "sint-gillis", "sint-joost", "watermaal", "oudergem", "evere", "sint-lambrechts", "ganshoren", "koekelberg", "sint-agatha"],
      "Antwerpen": ["antwerp", "berchem", "borgerhout", "deurne", "hoboken", "merksem", "wilrijk", "edegem", "mortsel", "schoten", "brasschaat", "kapellen", "kontich", "lint", "hove", "boechout", "borsbeek", "wijnegem", "wommelgem", "ranst", "schilde"],
      "Gent": ["gent", "gentbrugge", "ledeberg", "sint-amandsberg", "wondelgem", "mariakerke", "drongen", "destelbergen", "melle", "merelbeke", "de pinte", "sint-martens-latem", "lochristi"],
      "Leuven": ["leuven", "heverlee", "kessel-lo", "wilsele", "wijgmaal", "haasrode", "bertem", "oud-heverlee", "tervuren", "overijse"],
      "Mechelen": ["mechelen", "bonheiden", "sint-katelijne-waver", "putte", "duffel", "lier"],
      "Hasselt": ["hasselt", "genk", "diepenbeek", "zonhoven", "herk-de-stad"],
      "Brugge": ["brugge", "damme", "knokke", "zeebrugge", "blankenberge"],
      "Luik": ["luik", "liege", "seraing", "herstal", "ans", "grace-hollogne"],
    }
    for (const [marketCity, keywords] of Object.entries(regionKeywords)) {
      if (keywords.some((k) => cityLower.includes(k))) {
        return belgianMarketDB.find((m) => m.city === marketCity) || null
      }
    }
    return null
  }

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      const sqm = parseInt(analyzeSqm) || 0
      const bedrooms = parseInt(analyzeBedrooms) || 0
      const purchasePrice = parseInt(analyzePurchasePrice) || 0
      const currentRent = parseInt(analyzeCurrentRent) || 0

      const market = findClosestMarket(analyzeCity, analyzeZip)
      if (!market || !analyzeType || sqm === 0) { setIsAnalyzing(false); return }

      const typeKey = analyzeType as keyof Pick<MarketEntry, "apartment" | "house" | "studio" | "commercial">
      const typeData = market[typeKey]

      // Calculate suggested rent
      const typeMultiplier = analyzeType === "commercial" ? 1.3 : analyzeType === "house" ? 1.08 : analyzeType === "studio" ? 0.9 : 1.0
      const bedroomBonus = bedrooms * 65
      const demandAdjustment = 1 + ((market.demandIndex - 70) / 500)
      const rawRent = market.avgRentPerSqm * typeMultiplier * sqm * demandAdjustment + bedroomBonus
      const suggestedRent = Math.round(Math.max(typeData.rentMin, Math.min(typeData.rentMax, rawRent)) / 10) * 10

      // Calculate suggested sale price
      const rawSalePerSqm = market.avgSalePerSqm * typeMultiplier * demandAdjustment
      const suggestedSalePrice = Math.round(rawSalePerSqm * sqm / 1000) * 1000
      const saleMin = Math.round(typeData.saleMin * sqm / 1000) * 1000
      const saleMax = Math.round(typeData.saleMax * sqm / 1000) * 1000

      const rentPerSqm = sqm > 0 ? suggestedRent / sqm : 0
      const salePerSqm = sqm > 0 ? suggestedSalePrice / sqm : 0

      let positioning: "under" | "market" | "above" = "market"
      let positioningPercent = 0
      if (currentRent > 0) {
        positioningPercent = ((currentRent - typeData.rentAvg) / typeData.rentAvg) * 100
        if (positioningPercent < -5) positioning = "under"
        else if (positioningPercent > 5) positioning = "above"
      }

      const grossYield = purchasePrice > 0 ? (suggestedRent * 12 / purchasePrice) * 100 : null

      // Generate nearby comparable properties (simulated from portfolio + synthetic)
      const nearbyProps: AnalysisResult["nearbyProps"] = []
      const matchingProps = properties.filter((p) => {
        const dist = Math.sqrt(Math.pow(p.lat - market.lat, 2) + Math.pow(p.lng - market.lng, 2))
        return dist < 0.15
      })
      matchingProps.forEach((p) => {
        nearbyProps.push({
          name: p.name,
          lat: p.lat,
          lng: p.lng,
          rent: p.monthlyRent,
          saleEst: Math.round(market.avgSalePerSqm * p.sqm / 1000) * 1000,
          sqm: p.sqm,
          type: typeLabels[p.type],
        })
      })
      // Add synthetic nearby comparables
      const syntheticNames = ["Residentie Parc", "Appartement Centrum", "Woning Stationsstraat", "Studio Marktplein", "Kantoor Handelslei"]
      for (let i = nearbyProps.length; i < 5; i++) {
        const offset = { lat: (Math.random() - 0.5) * 0.04, lng: (Math.random() - 0.5) * 0.06 }
        const synthSqm = sqm + Math.round((Math.random() - 0.5) * 40)
        const synthRent = Math.round((typeData.rentAvg + (Math.random() - 0.5) * (typeData.rentMax - typeData.rentMin) * 0.5) / 10) * 10
        nearbyProps.push({
          name: syntheticNames[i] || `Vergelijkbaar ${i + 1}`,
          lat: market.lat + offset.lat,
          lng: market.lng + offset.lng,
          rent: synthRent,
          saleEst: Math.round(market.avgSalePerSqm * synthSqm / 1000) * 1000,
          sqm: synthSqm,
          type: typeLabels[analyzeType],
        })
      }

      // Generate advice
      const advice: string[] = []
      if (currentRent > 0 && currentRent < suggestedRent * 0.9) {
        advice.push(`Uw huidige huur (${currentRent}) ligt ${Math.round(((suggestedRent - currentRent) / suggestedRent) * 100)}% onder de marktwaarde. Overweeg een huurverhoging bij contractverlenging.`)
      }
      if (currentRent > 0 && currentRent > suggestedRent * 1.1) {
        advice.push("Uw huur ligt boven het marktgemiddelde. Dit kan het leegstandsrisico verhogen bij huurderwissel.")
      }
      if (market.demandIndex >= 80) {
        advice.push(`Hoge vraag in ${market.city} (index: ${market.demandIndex}/100). Goed moment om beschikbare panden te verhuren of te verkopen.`)
      }
      if (market.vacancyRate > 5) {
        advice.push(`Leegstandspercentage in ${market.city} is ${market.vacancyRate}%. Overweeg een competitieve prijs.`)
      }
      if (typeData.rentTrend > 4) {
        advice.push(`${typeLabels[analyzeType]}en in ${market.city} stijgen snel (+${typeData.rentTrend}% huur/jaar, +${typeData.saleTrend}% verkoop/jaar).`)
      }
      if (grossYield !== null) {
        if (grossYield >= 5) advice.push(`Uitstekend bruto rendement van ${grossYield.toFixed(1)}%. Dit pand presteert bovengemiddeld.`)
        else if (grossYield >= 3.5) advice.push(`Goed rendement van ${grossYield.toFixed(1)}%. Conform de Belgische markt.`)
        else advice.push(`Rendement van ${grossYield.toFixed(1)}% is onder het Belgisch gemiddelde (3.5-5%). Evalueer uw strategie.`)
      }
      // Sale advice
      if (purchasePrice > 0 && suggestedSalePrice > purchasePrice * 1.2) {
        const appreciation = ((suggestedSalePrice - purchasePrice) / purchasePrice * 100).toFixed(0)
        advice.push(`Geschatte meerwaarde van ${appreciation}% t.o.v. aankoopprijs. Overwegen om te verkopen of te herfinancieren.`)
      }
      if (advice.length === 0) {
        advice.push("Uw pand is marktconform geprijsd. Blijf de lokale trends volgen voor optimale huur- en verkoopprijzen.")
      }

      setAnalysisResult({
        city: market.city,
        matchedMarket: market,
        suggestedRent,
        rentRange: { min: typeData.rentMin, max: typeData.rentMax },
        suggestedSalePrice,
        saleRange: { min: saleMin, max: saleMax },
        rentPerSqm,
        salePerSqm,
        marketAvgRentPerSqm: market.avgRentPerSqm,
        marketAvgSalePerSqm: market.avgSalePerSqm,
        positioning,
        positioningPercent,
        demandIndex: market.demandIndex,
        vacancyRate: market.vacancyRate,
        rentTrend: typeData.rentTrend,
        saleTrend: typeData.saleTrend,
        grossYield,
        nearbyProps,
        advice,
      })
      setIsAnalyzing(false)
    }, 800)
  }

  const marketOverview = belgianMarketDB.slice(0, 10).map((m) => ({
    city: m.city,
    appartement: m.apartment.rentAvg,
    woning: m.house.rentAvg,
    studio: m.studio.rentAvg,
    vraagIndex: m.demandIndex,
  }))

  const saleOverview = belgianMarketDB.slice(0, 10).map((m) => ({
    city: m.city,
    appartement: m.apartment.saleAvg,
    woning: m.house.saleAvg,
    studio: m.studio.saleAvg,
  }))

  const demandVsVacancy = belgianMarketDB.slice(0, 10).map((m) => ({
    city: m.city,
    vraag: m.demandIndex,
    leegstand: m.vacancyRate,
  }))

  const portfolioPositioning = properties.map((p) => {
    const market = belgianMarketDB.find((m) => m.city === p.city)
    const typeKey = p.type as keyof Pick<MarketEntry, "apartment" | "house" | "studio" | "commercial">
    const marketAvg = market ? market[typeKey].rentAvg : 0
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
        <p className="text-muted-foreground">Huur- en verkoopprijzen bepalen op basis van Belgische marktdata</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Gem. Bezetting</CardTitle></CardHeader>
          <CardContent><div className="flex items-center gap-2"><Percent className="size-5 text-green-500" /><span className="text-2xl font-bold">{avgOccupancy.toFixed(0)}%</span></div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Portefeuillewaarde</CardTitle></CardHeader>
          <CardContent><div className="flex items-center gap-2"><Euro className="size-5 text-blue-500" /><span className="text-2xl font-bold">&euro;{(totalMonthlyRevenue * 12).toLocaleString()}/jr</span></div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Gem. Huur/m&sup2;</CardTitle></CardHeader>
          <CardContent><div className="flex items-center gap-2"><Building2 className="size-5 text-purple-500" /><span className="text-2xl font-bold">&euro;{avgPricePerSqm.toFixed(2)}</span></div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Totaal Oppervlakte</CardTitle></CardHeader>
          <CardContent><div className="flex items-center gap-2"><Ruler className="size-5 text-cyan-500" /><span className="text-2xl font-bold">{totalSqm} m&sup2;</span></div></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analyze" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analyze"><Target className="size-4 mr-2" /> Pand Analyseren</TabsTrigger>
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
              <CardDescription>Voer locatiegegevens en pandkenmerken in voor een marktconforme huur- en verkoopprijsbepaling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Adres</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input placeholder="Bijv. Grote Markt 1" value={analyzeAddress} onChange={(e) => setAnalyzeAddress(e.target.value)} className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stad / Gemeente</label>
                  <div className="relative">
                    <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input placeholder="Bijv. Antwerpen, Elsene, Merksem..." value={analyzeCity} onChange={(e) => setAnalyzeCity(e.target.value)} className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Postcode</label>
                  <Input placeholder="Bijv. 2000" value={analyzeZip} onChange={(e) => setAnalyzeZip(e.target.value)} />
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-3">
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
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Huidige huurprijs (optioneel)</label>
                  <Input type="number" placeholder="bijv. 1200" value={analyzeCurrentRent} onChange={(e) => setAnalyzeCurrentRent(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Aankoopprijs (optioneel)</label>
                  <Input type="number" placeholder="bijv. 250000" value={analyzePurchasePrice} onChange={(e) => setAnalyzePurchasePrice(e.target.value)} />
                </div>
              </div>

              <Button onClick={handleAnalyze} disabled={!analyzeCity || !analyzeType || !analyzeSqm || isAnalyzing} className="w-full sm:w-auto">
                {isAnalyzing ? <><Zap className="size-4 mr-2 animate-pulse" /> Analyseren...</> : <><Calculator className="size-4 mr-2" /> Analyseer Pand</>}
              </Button>

              {analysisResult && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-4" />
                    <span>Marktdata voor <strong className="text-foreground">{analysisResult.city}</strong> ({analysisResult.matchedMarket.region})</span>
                  </div>

                  {/* Price Results - Rent & Sale side by side */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-primary/30 bg-primary/5">
                      <CardContent className="p-5">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Aanbevolen Huurprijs</p>
                        <p className="text-3xl font-bold text-primary">&euro;{analysisResult.suggestedRent.toLocaleString()}<span className="text-base font-normal">/mnd</span></p>
                        <div className="mt-3 space-y-1.5">
                          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Bereik</span><span className="font-medium">&euro;{analysisResult.rentRange.min} - &euro;{analysisResult.rentRange.max}/mnd</span></div>
                          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Per m&sup2;</span><span className="font-medium">&euro;{analysisResult.rentPerSqm.toFixed(2)}/m&sup2;</span></div>
                          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Markt gem.</span><span className="font-medium">&euro;{analysisResult.marketAvgRentPerSqm}/m&sup2;</span></div>
                          <div className="flex items-center gap-1 text-sm"><ArrowUpRight className="size-3.5 text-green-500" /><span className="text-green-600 font-medium">+{analysisResult.rentTrend}%/jaar</span></div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-emerald-500/30 bg-emerald-500/5">
                      <CardContent className="p-5">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Geschatte Verkoopprijs</p>
                        <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">&euro;{analysisResult.suggestedSalePrice.toLocaleString()}</p>
                        <div className="mt-3 space-y-1.5">
                          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Bereik</span><span className="font-medium">&euro;{analysisResult.saleRange.min.toLocaleString()} - &euro;{analysisResult.saleRange.max.toLocaleString()}</span></div>
                          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Per m&sup2;</span><span className="font-medium">&euro;{analysisResult.salePerSqm.toLocaleString()}/m&sup2;</span></div>
                          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Markt gem.</span><span className="font-medium">&euro;{analysisResult.marketAvgSalePerSqm.toLocaleString()}/m&sup2;</span></div>
                          <div className="flex items-center gap-1 text-sm"><ArrowUpRight className="size-3.5 text-green-500" /><span className="text-green-600 font-medium">+{analysisResult.saleTrend}%/jaar</span></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Market indicators */}
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

                  {/* Nearby Prices Map */}
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="size-5 text-primary" />
                        <CardTitle className="text-base">Prijzen in de buurt</CardTitle>
                      </div>
                      <CardDescription>Vergelijkbare panden en prijzen nabij uw locatie</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <NearbyPricesMap
                        centerLat={analysisResult.matchedMarket.lat}
                        centerLng={analysisResult.matchedMarket.lng}
                        nearbyProps={analysisResult.nearbyProps}
                        analyzedPrice={analysisResult.suggestedRent}
                      />
                    </CardContent>
                  </Card>

                  {/* Nearby comparables table */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Vergelijkbare Panden</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 px-2 font-medium">Pand</th>
                              <th className="text-right py-2 px-2 font-medium">Huurprijs</th>
                              <th className="text-right py-2 px-2 font-medium">Verkoopwaarde</th>
                              <th className="text-right py-2 px-2 font-medium">m&sup2;</th>
                              <th className="text-right py-2 px-2 font-medium">&euro;/m&sup2;</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analysisResult.nearbyProps.map((p, i) => (
                              <tr key={i} className="border-b last:border-0 hover:bg-muted/50">
                                <td className="py-2 px-2">
                                  <p className="font-medium">{p.name}</p>
                                  <p className="text-xs text-muted-foreground">{p.type}</p>
                                </td>
                                <td className="text-right py-2 px-2 font-medium">&euro;{p.rent.toLocaleString()}/mnd</td>
                                <td className="text-right py-2 px-2 font-medium">&euro;{p.saleEst.toLocaleString()}</td>
                                <td className="text-right py-2 px-2">{p.sqm} m&sup2;</td>
                                <td className="text-right py-2 px-2">&euro;{(p.rent / p.sqm).toFixed(1)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Advice */}
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
              <CardDescription>Real-time huur- en verkoopprijzen per stad en type - Laatste update: 6 maart 2026</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium">Stad</th>
                      <th className="text-right py-3 px-2 font-medium">Huur App.</th>
                      <th className="text-right py-3 px-2 font-medium">Verkoop/m&sup2;</th>
                      <th className="text-right py-3 px-2 font-medium">Huur/m&sup2;</th>
                      <th className="text-right py-3 px-2 font-medium">Vraag</th>
                      <th className="text-right py-3 px-2 font-medium">Leegstand</th>
                    </tr>
                  </thead>
                  <tbody>
                    {belgianMarketDB.map((m) => (
                      <tr key={m.city} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-2.5 px-2">
                          <div>
                            <p className="font-medium">{m.city}</p>
                            <p className="text-xs text-muted-foreground">{m.region}</p>
                          </div>
                        </td>
                        <td className="text-right py-2.5 px-2">
                          <span className="font-medium">&euro;{m.apartment.rentAvg}</span>
                          <span className="text-xs text-green-600 ml-1">+{m.apartment.rentTrend}%</span>
                        </td>
                        <td className="text-right py-2.5 px-2">
                          <span className="font-medium">&euro;{m.avgSalePerSqm.toLocaleString()}</span>
                          <span className="text-xs text-green-600 ml-1">+{m.apartment.saleTrend}%</span>
                        </td>
                        <td className="text-right py-2.5 px-2 font-medium">&euro;{m.avgRentPerSqm}</td>
                        <td className="text-right py-2.5 px-2">
                          <Badge variant={m.demandIndex >= 80 ? "default" : m.demandIndex >= 60 ? "secondary" : "outline"} className="text-[10px]">{m.demandIndex}</Badge>
                        </td>
                        <td className="text-right py-2.5 px-2">
                          <span className={m.vacancyRate <= 3 ? "text-green-600" : m.vacancyRate <= 5 ? "text-yellow-600" : "text-red-600"}>{m.vacancyRate}%</span>
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
                <CardTitle>Verkoopprijzen per m&sup2;</CardTitle>
                <CardDescription>Gemiddelde verkoopprijs per type en stad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={saleOverview} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" tick={{ fill: "currentColor", fontSize: 11 }} />
                      <YAxis dataKey="city" type="category" tick={{ fill: "currentColor", fontSize: 11 }} width={80} />
                      <Tooltip formatter={(value: number) => [`\u20AC${value}/m\u00B2`, ""]} />
                      <Legend />
                      <Bar dataKey="appartement" fill="#10b981" name="Appartement" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="woning" fill="#059669" name="Woning" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="studio" fill="#6ee7b7" name="Studio" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Prijstrend Verkoop/m&sup2;</CardTitle>
                <CardDescription>Evolutie Q1 2025 - Q1 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
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

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MapPin className="size-5 text-primary" />
                  <CardTitle>Marktprijzen Kaart</CardTitle>
                </div>
                <CardDescription>Verkoopprijzen per stad en uw pandprijzen</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <MarketOverviewMap />
              </CardContent>
            </Card>
          </div>

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
        </TabsContent>

        {/* ── Tab 3: Portefeuille ───────────────────────────────────── */}
        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bot className="size-5 text-primary" />
                <CardTitle>AI Prijsaanbevelingen</CardTitle>
              </div>
              <CardDescription>Uw panden vergeleken met real-time marktdata (huur & verkoop)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {properties.map((property) => {
                  const market = belgianMarketDB.find((m) => m.city === property.city)
                  const typeKey = property.type as keyof Pick<MarketEntry, "apartment" | "house" | "studio" | "commercial">
                  const marketAvg = market ? market[typeKey].rentAvg : 0
                  const saleEst = market ? Math.round(market.avgSalePerSqm * property.sqm / 1000) * 1000 : 0
                  const diff = marketAvg > 0 ? ((property.monthlyRent - marketAvg) / marketAvg) * 100 : 0
                  const rentTrend = market ? market[typeKey].rentTrend : 0
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
                          <p className="text-muted-foreground">Huur: &euro;{property.monthlyRent.toLocaleString()}/mnd (markt: &euro;{marketAvg.toLocaleString()})</p>
                          <p className="font-medium">Geschatte waarde: &euro;{saleEst.toLocaleString()}</p>
                          {isBelow && <p className="text-green-600 text-xs font-medium">Verhoog huur naar &euro;{Math.round(marketAvg * 0.98)}/mnd</p>}
                          {isAbove && <p className="text-orange-600 text-xs font-medium">{Math.round(diff)}% boven markt</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-green-600">+{rentTrend}%/jr</span>
                          {isBelow ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30"><TrendingUp className="size-3 mr-1" /> Verhogen</Badge>
                          ) : isAbove ? (
                            <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/30"><TrendingDown className="size-3 mr-1" /> Beoordelen</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/30"><Minus className="size-3 mr-1" /> Marktconform</Badge>
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
                      <Bar dataKey="markt" fill="#a78bfa" name="Marktgemiddelde" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Portefeuille Verdeling</CardTitle>
                <CardDescription>Type verdeling van uw panden</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={typeDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                        {typeDistribution.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
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
