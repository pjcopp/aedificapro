"use client"

import { useState } from "react"
import { UserCog, Building2, Plus, Upload, Camera } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { teamMembers } from "@/lib/mock-data"

const roleColors: Record<string, string> = { admin: "bg-red-500/10 text-red-600 border-red-500/30", manager: "bg-blue-500/10 text-blue-600 border-blue-500/30", agent: "bg-green-500/10 text-green-600 border-green-500/30" }
const roleLabels: Record<string, string> = { admin: "Beheerder", manager: "Manager", agent: "Makelaar" }

export function TeamModule({ onLogoChange }: { onLogoChange?: (url: string | null) => void }) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [memberPhotos, setMemberPhotos] = useState<Record<string, string>>({})

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold tracking-tight">Team & Instellingen</h2><p className="text-muted-foreground">Beheer uw team en platforminstellingen</p></div>
      <Tabs defaultValue="team">
        <TabsList><TabsTrigger value="team">Teamleden</TabsTrigger><TabsTrigger value="branding">Huisstijl</TabsTrigger><TabsTrigger value="settings">Instellingen</TabsTrigger></TabsList>
        <TabsContent value="team" className="space-y-4 mt-4">
          <div className="flex justify-end"><Button><Plus className="size-4 mr-2" /> Lid Uitnodigen</Button></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="relative group"><Avatar className="size-12"><AvatarImage src={memberPhotos[member.id] || member.photoUrl} alt={member.name} /><AvatarFallback className="bg-primary text-primary-foreground">{member.avatar}</AvatarFallback></Avatar><button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={(e) => { e.stopPropagation(); const input = document.createElement("input"); input.type = "file"; input.accept = "image/*"; input.onchange = (ev) => { const file = (ev.target as HTMLInputElement).files?.[0]; if (file) setMemberPhotos(prev => ({ ...prev, [member.id]: URL.createObjectURL(file) })) }; input.click() }}><Camera className="size-4 text-white" /></button></div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{member.name}</h4>
                      <Badge variant="outline" className={`mt-1 ${roleColors[member.role]}`}>{roleLabels[member.role]}</Badge>
                      <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                        <p>{member.email}</p><p>{member.phone}</p>
                        <p className="flex items-center gap-1"><Building2 className="size-3.5" /> {member.properties} panden</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="branding" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Bedrijfshuisstijl</CardTitle><CardDescription>Pas het platform aan met uw bedrijfslogo</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <div className="flex size-24 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50">
                  {logoPreview ? <img src={logoPreview} alt="Logo" className="max-h-16 max-w-20 object-contain" /> : <Upload className="size-8 text-muted-foreground/50" />}
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Bedrijfslogo</p>
                  <p className="text-xs text-muted-foreground">Upload uw logo om in de header en sidebar weer te geven. Aanbevolen: PNG of SVG, max 200x50px.</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => {
                      const url = prompt("Voer logo URL in (of laat leeg voor standaard):")
                      if (url !== null) { setLogoPreview(url || null); onLogoChange?.(url || null) }
                    }}>Logo Uploaden</Button>
                    {logoPreview && <Button size="sm" variant="ghost" onClick={() => { setLogoPreview(null); onLogoChange?.(null) }}>Verwijderen</Button>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Accountinstellingen</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2"><label className="text-sm font-medium">Bedrijfsnaam</label><Input defaultValue="AedificaPro BVBA" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">E-mail</label><Input defaultValue="info@aedificapro.be" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Telefoon</label><Input defaultValue="+32 2 000 00 00" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Adres</label><Input defaultValue="Brussel, Belgie" /></div>
              </div>
              <div className="flex justify-end"><Button>Instellingen Opslaan</Button></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
