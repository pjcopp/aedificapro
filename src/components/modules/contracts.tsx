"use client"

import { useState } from "react"
import { FileText, Plus, Calendar, User, AlertTriangle, CheckCircle2, Edit3, Save, X, Printer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { properties } from "@/lib/mock-data"
import type { Property } from "@/lib/mock-data"

type ContractDraft = {
  huurprijs: string
  borgsom: string
  betalingsdag: string
  opzegtermijn: string
  bijzondereVoorwaarden: string
}

function EditableField({ label, value, editing, onChange, type = "text" }: {
  label: string; value: string; editing: boolean; onChange: (v: string) => void; type?: string
}) {
  return (
    <div>
      <label className="text-sm text-muted-foreground">{label}</label>
      {editing ? (
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1" type={type} />
      ) : (
        <p className="font-medium text-sm mt-1">{value}</p>
      )}
    </div>
  )
}

export function ContractView({ property, onBack, backLabel }: { property: Property; onBack: () => void; backLabel?: string }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<ContractDraft>({
    huurprijs: property.monthlyRent.toString(),
    borgsom: (property.monthlyRent * 2).toString(),
    betalingsdag: "1",
    opzegtermijn: "3 maanden",
    bijzondereVoorwaarden: "Het pand mag niet onderverhuurd worden zonder schriftelijke toestemming van de verhuurder.\n\nHuisdieren zijn toegestaan mits voorafgaande schriftelijke toestemming van de verhuurder.\n\nDe huurder verbindt zich ertoe de gemeenschappelijke delen met respect te gebruiken en de reglementen van mede-eigendom na te leven.",
  })

  const update = (field: keyof ContractDraft, value: string) => setDraft((prev) => ({ ...prev, [field]: value }))

  const typeLabel = property.type === "apartment" ? "appartement" : property.type === "house" ? "huis" : property.type === "studio" ? "studio" : "commercieel pand"
  const utilTotal = property.utilities.reduce((s, u) => s + u.monthlyCost, 0)
  const borgMaanden = Math.round(parseInt(draft.borgsom) / parseInt(draft.huurprijs)) || 2

  const handlePdfExport = () => {
    const w = window.open("", "_blank")
    if (!w) { alert("Pop-up geblokkeerd. Sta pop-ups toe voor deze site."); return }

    const utilRows = property.utilities.map(u => `<tr><td>${u.name}</td><td style="text-align:right;font-weight:600;">&euro;${u.monthlyCost}/mnd</td></tr>`).join("")
    const conditions = draft.bijzondereVoorwaarden.split("\n").filter(l => l.trim()).map(l => `<p>${l}</p>`).join("")

    w.document.write(`<!DOCTYPE html><html lang="nl"><head><meta charset="UTF-8"><title>Huurovereenkomst - ${property.name}</title>
<style>
@page{margin:25mm 20mm;size:A4}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Georgia,'Times New Roman',serif;line-height:1.7;color:#1a1a1a;max-width:700px;margin:0 auto;padding:40px 20px;font-size:12.5px}
h1{text-align:center;font-size:22px;letter-spacing:3px;margin-bottom:4px;font-weight:700}
.subtitle{text-align:center;color:#666;margin-bottom:24px;font-size:12px;font-style:italic}
h2{font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:#333;margin-top:24px;margin-bottom:8px;border-bottom:1px solid #ccc;padding-bottom:4px;font-weight:700}
p{margin:5px 0;text-align:justify}
.parties{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin:16px 0}
.party-title{font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:#888;margin-bottom:6px;font-weight:700}
b{font-weight:700}
.sep{border:none;border-top:1px solid #ddd;margin:16px 0}
table{width:100%;border-collapse:collapse;margin:8px 0}
td{padding:3px 0;font-size:12px}
.total td{border-top:1px solid #ccc;padding-top:6px;font-weight:700}
.signatures{display:grid;grid-template-columns:1fr 1fr;gap:60px;margin-top:50px}
.sig-line{border-bottom:1px solid #333;width:200px;margin-top:60px;margin-bottom:6px}
.footer{text-align:center;font-size:10px;color:#999;margin-top:40px;padding-top:16px;border-top:1px solid #eee}
@media print{body{padding:0}}
</style></head><body>
<h1>HUUROVEREENKOMST</h1>
<p class="subtitle">Woninghuurovereenkomst conform het Belgisch Burgerlijk Wetboek<br>Boek III, Titel VIII, Hoofdstuk II</p>
<hr class="sep">
<p style="text-align:center;font-size:11px;color:#666;margin-bottom:16px;">Ref: AEP-${property.id.toUpperCase()}-${new Date().getFullYear()}</p>

<div class="parties">
<div><div class="party-title">Verhuurder</div><p><b>AedificaPro BVBA</b></p><p>Sarah van Dijk</p><p>Wetstraat 100, 1040 Brussel</p><p>BTW: BE 0123.456.789</p></div>
<div><div class="party-title">Huurder</div><p><b>${property.tenant?.name || "_______________"}</b></p>${property.tenant ? `<p>${property.tenant.email}</p><p>${property.tenant.phone}</p><p>${property.tenant.address}</p>` : `<p style="color:#999;font-style:italic;">Nog te bepalen</p>`}</div>
</div>
<p style="margin-top:16px;">Hierna gezamenlijk "de Partijen" genoemd, wordt het volgende overeengekomen:</p>
<hr class="sep">

<h2>Artikel 1 &mdash; Voorwerp van de huur</h2>
<p>De Verhuurder verhuurt aan de Huurder het onroerend goed gelegen te <b>${property.address}, ${property.zipCode} ${property.city}</b>. Het betreft een <b>${typeLabel}</b> met een oppervlakte van <b>${property.sqm} m&sup2;</b>, bestaande uit <b>${property.bedrooms} slaapkamer(s)</b> en <b>${property.bathrooms} badkamer(s)</b>. Het gehuurde goed wordt verhuurd met alle vaste toebehoren en uitrustingen.</p>

<h2>Artikel 2 &mdash; Duur van de huur</h2>
<p>De huur gaat in op <b>${property.leaseStart || "nader te bepalen"}</b> en eindigt op <b>${property.leaseEnd || "nader te bepalen"}</b>. Bij gebrek aan opzegging minstens <b>${draft.opzegtermijn}</b> v&oacute;&oacute;r het einde, wordt de huur stilzwijgend verlengd voor eenzelfde periode.</p>

<h2>Artikel 3 &mdash; Huurprijs</h2>
<p>De maandelijkse huurprijs bedraagt <b>&euro;${parseInt(draft.huurprijs).toLocaleString()}</b>, te betalen v&oacute;&oacute;r de <b>${draft.betalingsdag}e van elke maand</b> door overschrijving. De huurprijs wordt jaarlijks ge&iuml;ndexeerd volgens de gezondheidsindex.</p>

<h2>Artikel 4 &mdash; Huurwaarborg</h2>
<p>De Huurder stort een waarborg van <b>&euro;${parseInt(draft.borgsom).toLocaleString()}</b> (${borgMaanden} maanden huur) op een geblokkeerde rekening. De waarborg wordt teruggestort bij einde huur, na aftrek van eventuele schade.</p>

<h2>Artikel 5 &mdash; Lasten en kosten</h2>
<p>Naast de huurprijs is de Huurder volgende kosten verschuldigd:</p>
<table>${utilRows}<tr class="total"><td>Totaal provisie</td><td style="text-align:right">&euro;${utilTotal}/mnd</td></tr></table>
<p>Jaarlijks volgt een afrekening op basis van werkelijke kosten. <b>Totale maandelijkse kost: &euro;${(parseInt(draft.huurprijs) + utilTotal).toLocaleString()}</b>.</p>

<h2>Artikel 6 &mdash; Bestemming</h2>
<p>Het goed mag uitsluitend worden gebruikt als ${property.type === "commercial" ? "commerci&euml;le ruimte" : "hoofdverblijfplaats"}. De Huurder onderhoud het als een goede huisvader.</p>

<h2>Artikel 7 &mdash; Plaatsbeschrijving</h2>
<p>Bij aanvang wordt een omstandige plaatsbeschrijving opgesteld. De kosten worden gelijk verdeeld. Bij einde huur volgt een uitgaande plaatsbeschrijving.</p>

<h2>Artikel 8 &mdash; Onderhoud en herstellingen</h2>
<p>Kleine herstellingen en dagelijks onderhoud zijn ten laste van de Huurder. Grote herstellingen door ouderdom of overmacht zijn ten laste van de Verhuurder.</p>

<h2>Artikel 9 &mdash; Verzekeringen</h2>
<p>De Huurder sluit een brandverzekering af met dekking voor huurdersaansprakelijkheid. Bewijs wordt bij aanvang voorgelegd.</p>

<h2>Artikel 10 &mdash; Onderverhuring en overdracht</h2>
<p>Onderverhuring of overdracht is verboden zonder schriftelijke toestemming van de Verhuurder.</p>

<h2>Artikel 11 &mdash; Bezoekrecht</h2>
<p>De Verhuurder mag het goed bezoeken mits 24 uur kennisgeving, behalve bij hoogdringendheid. Gedurende de laatste 3 maanden mag het goed bezichtigd worden door kandidaat-huurders.</p>

<h2>Artikel 12 &mdash; Opzegging</h2>
<p>Elke partij kan opzeggen met een termijn van <b>${draft.opzegtermijn}</b>, per aangetekend schrijven. De termijn gaat in op de eerste dag van de volgende maand.</p>

<h2>Artikel 13 &mdash; Bijzondere voorwaarden</h2>
${conditions}

<h2>Artikel 14 &mdash; Geschillenregeling</h2>
<p>Geschillen worden voorgelegd aan de bevoegde Vrederechter van het kanton van het gehuurde goed.</p>

<h2>Artikel 15 &mdash; Registratie</h2>
<p>Registratie is wettelijk verplicht en ten laste van de Verhuurder, conform de wettelijke bepalingen.</p>

<hr class="sep">
<div class="signatures">
<div><p style="font-size:11px;color:#888;">Handtekening Verhuurder</p><p style="font-size:10px;color:#aaa;margin-top:4px;">Gelezen en goedgekeurd</p><div class="sig-line"></div><p style="font-weight:600;">Sarah van Dijk</p><p style="font-size:11px;color:#666;">AedificaPro BVBA</p><p style="font-size:11px;color:#666;">Datum: ____/____/________</p></div>
<div><p style="font-size:11px;color:#888;">Handtekening Huurder</p><p style="font-size:10px;color:#aaa;margin-top:4px;">Gelezen en goedgekeurd</p><div class="sig-line"></div><p style="font-weight:600;">${property.tenant?.name || "_______________"}</p><p style="font-size:11px;color:#666;">Datum: ____/____/________</p></div>
</div>

<p class="footer">Opgemaakt in twee originele exemplaren te Brussel.<br>Elke partij verklaart &eacute;&eacute;n exemplaar te hebben ontvangen.<br>Ref: AEP-${property.id.toUpperCase()}-${new Date().getFullYear()} | AedificaPro Vastgoedbeheer</p>
</body></html>`)

    w.document.close()
    w.focus()
    setTimeout(() => w.print(), 600)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack}>&larr; {backLabel || "Terug naar Contracten"}</Button>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button size="sm" variant="outline" onClick={() => setEditing(false)}><X className="size-4 mr-1" /> Annuleren</Button>
              <Button size="sm" onClick={() => setEditing(false)}><Save className="size-4 mr-1" /> Opslaan</Button>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}><Edit3 className="size-4 mr-1" /> Bewerken</Button>
          )}
          <Button size="sm" onClick={handlePdfExport}><Printer className="size-4 mr-1" /> PDF Exporteren</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-8 max-w-3xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-widest">HUUROVEREENKOMST</h2>
            <p className="text-muted-foreground mt-1 text-sm italic">Woninghuurovereenkomst conform Belgisch huurrecht</p>
            <p className="text-xs text-muted-foreground mt-2">Ref: AEP-{property.id.toUpperCase()}-{new Date().getFullYear()}</p>
            <Separator className="mt-4" />
          </div>

          {/* Parties */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-xs uppercase text-muted-foreground tracking-wider mb-3">Verhuurder</h3>
              <div className="space-y-1 text-sm"><p className="font-medium">AedificaPro BVBA</p><p>Sarah van Dijk</p><p>Wetstraat 100, 1040 Brussel</p><p>BTW: BE 0123.456.789</p></div>
            </div>
            <div>
              <h3 className="font-semibold text-xs uppercase text-muted-foreground tracking-wider mb-3">Huurder</h3>
              <div className="space-y-1 text-sm">
                {property.tenant ? (<><p className="font-medium">{property.tenant.name}</p><p>{property.tenant.email}</p><p>{property.tenant.phone}</p><p>{property.tenant.address}</p></>) : (<p className="text-muted-foreground italic">Nog geen huurder toegewezen</p>)}
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Article 1 */}
          <div className="mb-6">
            <h3 className="font-semibold text-xs uppercase text-muted-foreground tracking-wider mb-2">Artikel 1 — Voorwerp van de huur</h3>
            <p className="text-sm leading-relaxed">De Verhuurder verhuurt aan de Huurder het onroerend goed gelegen te <span className="font-semibold">{property.address}, {property.zipCode} {property.city}</span>. Het betreft een <span className="font-semibold">{typeLabel}</span> met een oppervlakte van <span className="font-semibold">{property.sqm} m&sup2;</span>, bestaande uit <span className="font-semibold">{property.bedrooms} slaapkamer(s)</span> en <span className="font-semibold">{property.bathrooms} badkamer(s)</span>. Het gehuurde goed wordt verhuurd met alle vaste toebehoren en uitrustingen.</p>
          </div>

          {/* Article 2 */}
          <div className="mb-6">
            <h3 className="font-semibold text-xs uppercase text-muted-foreground tracking-wider mb-2">Artikel 2 — Duur van de huur</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-3">
              <EditableField label="Ingangsdatum" value={property.leaseStart || "Nader te bepalen"} editing={false} onChange={() => {}} />
              <EditableField label="Einddatum" value={property.leaseEnd || "Nader te bepalen"} editing={false} onChange={() => {}} />
            </div>
            <p className="text-sm leading-relaxed">Bij gebrek aan opzegging minstens <span className="font-semibold">{draft.opzegtermijn}</span> v&oacute;&oacute;r het einde wordt de huur stilzwijgend verlengd.</p>
          </div>

          {/* Article 3 */}
          <div className="mb-6">
            <h3 className="font-semibold text-xs uppercase text-muted-foreground tracking-wider mb-2">Artikel 3 — Huurprijs</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-3">
              <EditableField label="Maandelijkse huurprijs" value={editing ? draft.huurprijs : `\u20AC${parseInt(draft.huurprijs).toLocaleString()}`} editing={editing} onChange={(v) => update("huurprijs", v)} type="number" />
              <EditableField label="Betalingsdag" value={editing ? draft.betalingsdag : `De ${draft.betalingsdag}e van elke maand`} editing={editing} onChange={(v) => update("betalingsdag", v)} />
            </div>
            <p className="text-sm leading-relaxed">De huurprijs wordt jaarlijks ge&iuml;ndexeerd volgens de gezondheidsindex.</p>
          </div>

          {/* Article 4 */}
          <div className="mb-6">
            <h3 className="font-semibold text-xs uppercase text-muted-foreground tracking-wider mb-2">Artikel 4 — Huurwaarborg</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-3">
              <EditableField label="Borgsom" value={editing ? draft.borgsom : `\u20AC${parseInt(draft.borgsom).toLocaleString()}`} editing={editing} onChange={(v) => update("borgsom", v)} type="number" />
              <EditableField label="Equivalent" value={`${borgMaanden} maanden huur`} editing={false} onChange={() => {}} />
            </div>
            <p className="text-sm leading-relaxed">De waarborg wordt geplaatst op een geblokkeerde rekening en teruggestort bij einde huur, na aftrek van eventuele schade.</p>
          </div>

          {/* Article 5 */}
          <div className="mb-6">
            <h3 className="font-semibold text-xs uppercase text-muted-foreground tracking-wider mb-2">Artikel 5 — Lasten en kosten</h3>
            <div className="bg-muted/50 rounded-lg p-4 mb-3">
              <div className="grid sm:grid-cols-2 gap-2 text-sm">
                {property.utilities.map((u) => (<div key={u.name} className="flex justify-between"><span className="text-muted-foreground">{u.name}</span><span className="font-medium">&euro;{u.monthlyCost}/mnd</span></div>))}
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between text-sm font-semibold"><span>Totaal provisie</span><span>&euro;{utilTotal}/mnd</span></div>
            </div>
            <p className="text-sm leading-relaxed">Jaarlijks volgt een afrekening op basis van werkelijke kosten. <span className="font-semibold">Totale maandelijkse kost: &euro;{(parseInt(draft.huurprijs) + utilTotal).toLocaleString()}</span>.</p>
          </div>

          {/* Articles 6-11 */}
          <div className="mb-6">
            <h3 className="font-semibold text-xs uppercase text-muted-foreground tracking-wider mb-2">Artikel 6 — Bestemming</h3>
            <p className="text-sm leading-relaxed">Het goed mag uitsluitend worden gebruikt als {property.type === "commercial" ? "commerci\u00EBle ruimte" : "hoofdverblijfplaats"}. De Huurder onderhoudt het als een goede huisvader.</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-xs uppercase text-muted-foreground tracking-wider mb-2">Artikel 7 — Plaatsbeschrijving</h3>
            <p className="text-sm leading-relaxed">Bij aanvang wordt een omstandige plaatsbeschrijving opgesteld. De kosten worden gelijk verdeeld tussen de Partijen. Bij einde huur volgt een uitgaande plaatsbeschrijving.</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-xs uppercase text-muted-foreground tracking-wider mb-2">Artikel 8 — Onderhoud en herstellingen</h3>
            <p className="text-sm leading-relaxed">Kleine herstellingen en dagelijks onderhoud zijn ten laste van de Huurder. Grote herstellingen door ouderdom, slijtage of overmacht zijn ten laste van de Verhuurder.</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-xs uppercase text-muted-foreground tracking-wider mb-2">Artikel 9 — Verzekeringen</h3>
            <p className="text-sm leading-relaxed">De Huurder sluit een brandverzekering af met dekking voor huurdersaansprakelijkheid, brand-, water- en stormschade. Bewijs wordt bij aanvang voorgelegd.</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-xs uppercase text-muted-foreground tracking-wider mb-2">Artikel 10 — Onderverhuring en overdracht</h3>
            <p className="text-sm leading-relaxed">Gehele of gedeeltelijke onderverhuring, evenals overdracht van huurrechten, is verboden zonder voorafgaande schriftelijke toestemming van de Verhuurder.</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-xs uppercase text-muted-foreground tracking-wider mb-2">Artikel 11 — Bezoekrecht</h3>
            <p className="text-sm leading-relaxed">De Verhuurder mag het goed bezoeken mits 24 uur kennisgeving, behalve bij hoogdringendheid. Gedurende de laatste drie maanden mag het goed bezichtigd worden door kandidaat-huurders of -kopers.</p>
          </div>

          {/* Article 12 */}
          <div className="mb-6">
            <h3 className="font-semibold text-xs uppercase text-muted-foreground tracking-wider mb-2">Artikel 12 — Opzegging</h3>
            <div className="mb-3">
              <EditableField label="Opzegtermijn" value={editing ? draft.opzegtermijn : draft.opzegtermijn} editing={editing} onChange={(v) => update("opzegtermijn", v)} />
            </div>
            <p className="text-sm leading-relaxed">Elke partij kan opzeggen per aangetekend schrijven. De termijn gaat in op de eerste dag van de maand volgend op verzending.</p>
          </div>

          {/* Article 13 */}
          <div className="mb-6">
            <h3 className="font-semibold text-xs uppercase text-muted-foreground tracking-wider mb-2">Artikel 13 — Bijzondere voorwaarden</h3>
            {editing ? (
              <Textarea value={draft.bijzondereVoorwaarden} onChange={(e) => update("bijzondereVoorwaarden", e.target.value)} rows={5} />
            ) : (
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{draft.bijzondereVoorwaarden}</div>
            )}
          </div>

          {/* Articles 14-15 */}
          <div className="mb-6">
            <h3 className="font-semibold text-xs uppercase text-muted-foreground tracking-wider mb-2">Artikel 14 — Geschillenregeling</h3>
            <p className="text-sm leading-relaxed">Alle geschillen worden voorgelegd aan de bevoegde Vrederechter van het kanton van het gehuurde goed.</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-xs uppercase text-muted-foreground tracking-wider mb-2">Artikel 15 — Registratie</h3>
            <p className="text-sm leading-relaxed">De registratie van deze overeenkomst is wettelijk verplicht en ten laste van de Verhuurder, conform de wettelijke bepalingen.</p>
          </div>

          <Separator className="my-6" />

          {/* Signatures */}
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Handtekening Verhuurder</p>
              <p className="text-xs text-muted-foreground mb-8">Gelezen en goedgekeurd</p>
              <div className="border-b border-foreground/30 w-48" />
              <p className="text-sm mt-2 font-medium">Sarah van Dijk</p>
              <p className="text-xs text-muted-foreground">AedificaPro BVBA</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Handtekening Huurder</p>
              <p className="text-xs text-muted-foreground mb-8">Gelezen en goedgekeurd</p>
              <div className="border-b border-foreground/30 w-48" />
              <p className="text-sm mt-2 font-medium">{property.tenant?.name || "_______________"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function ContractsModule() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  if (selectedProperty) {
    return <ContractView property={selectedProperty} onBack={() => setSelectedProperty(null)} />
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Contracten</h2>
        <p className="text-muted-foreground">Stel een nieuwe huurovereenkomst op en exporteer als PDF</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nieuw Huurcontract Opstellen</CardTitle>
          <CardDescription>Selecteer een pand om een huurovereenkomst op te stellen en te downloaden als PDF</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <Card key={property.id} className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5" onClick={() => setSelectedProperty(property)}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <FileText className="size-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium truncate">{property.name}</h4>
                      <p className="text-sm text-muted-foreground">{property.address}, {property.city}</p>
                      <div className="flex items-center gap-3 mt-2 text-sm">
                        <span className="font-medium">&euro;{property.monthlyRent.toLocaleString()}/mnd</span>
                        <span className="text-muted-foreground">{property.sqm} m&sup2;</span>
                      </div>
                      {property.tenant && (
                        <p className="text-xs text-muted-foreground mt-1">{property.tenant.name}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
