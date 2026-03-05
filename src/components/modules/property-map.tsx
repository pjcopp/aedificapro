"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { properties } from "@/lib/mock-data"

const statusColors: Record<string, string> = {
  occupied: "#374151",
  available: "#6b7280",
  maintenance: "#9ca3af",
  new: "#7c3aed",
}

const statusLabels: Record<string, string> = {
  occupied: "Verhuurd",
  available: "Beschikbaar",
  maintenance: "Onderhoud",
  new: "Nieuw",
}

export function PropertyMapModule() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [mapReady, setMapReady] = useState(false)

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
        const color = statusColors[property.status]

        const icon = L.divIcon({
          className: "custom-marker",
          html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2.5px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.15);transition:transform 0.2s;"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        })

        const marker = L.marker([property.lat, property.lng], { icon }).addTo(map)

        marker.bindPopup(`
          <div style="min-width:180px;font-family:system-ui,-apple-system,sans-serif;">
            <h3 style="font-weight:600;margin:0 0 4px 0;font-size:13px;color:#111;">${property.name}</h3>
            <p style="color:#6b7280;margin:0 0 6px 0;font-size:11px;">${property.address}, ${property.zipCode} ${property.city}</p>
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:600;font-size:13px;color:#111;">&euro;${property.monthlyRent.toLocaleString()}/mnd</span>
              <span style="font-size:10px;padding:2px 8px;border-radius:10px;background:#f3f4f6;color:#374151;font-weight:500;">${statusLabels[property.status]}</span>
            </div>
            ${property.tenant ? `<p style="font-size:10px;color:#9ca3af;margin:4px 0 0 0;">${property.tenant.name}</p>` : ""}
          </div>
        `)

        marker.on("click", () => setSelectedId(property.id))
      })

      setMapReady(true)
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

  const flyTo = (lat: number, lng: number) => {
    if (mapInstanceRef.current && mapReady) {
      (mapInstanceRef.current as { setView: (latlng: [number, number], zoom: number, options?: { animate: boolean }) => void }).setView([lat, lng], 14, { animate: true })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Pandenkaart</h2>
        <p className="text-muted-foreground">Geografisch overzicht van uw portefeuille</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div ref={mapRef} className="w-full h-[500px] rounded-lg z-0" />
        </CardContent>
      </Card>

      <div className="flex gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5"><div className="size-2.5 rounded-full bg-gray-700" /> Verhuurd</div>
        <div className="flex items-center gap-1.5"><div className="size-2.5 rounded-full bg-gray-500" /> Beschikbaar</div>
        <div className="flex items-center gap-1.5"><div className="size-2.5 rounded-full bg-gray-400" /> Onderhoud</div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <Card
            key={property.id}
            className={`transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${selectedId === property.id ? "ring-1 ring-primary" : ""}`}
            onClick={() => { setSelectedId(property.id); flyTo(property.lat, property.lng) }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-sm">{property.name}</h4>
                <Badge variant="secondary" className="text-[10px]">{statusLabels[property.status]}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{property.address}, {property.zipCode} {property.city}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium">&euro;{property.monthlyRent.toLocaleString()}/mnd</span>
                <span className="text-xs text-muted-foreground">{property.sqm} m&sup2;</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
