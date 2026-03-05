"use client"

import { useState } from "react"
import { Search, Send, Reply, Inbox, PenSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { emails, properties } from "@/lib/mock-data"
import type { EmailMessage } from "@/lib/mock-data"

export function EmailModule() {
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null)
  const [showCompose, setShowCompose] = useState(false)
  const [search, setSearch] = useState("")

  const filtered = emails.filter((e) => e.subject.toLowerCase().includes(search.toLowerCase()) || e.from.toLowerCase().includes(search.toLowerCase()) || e.to.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-2xl font-bold tracking-tight">E-mail</h2><p className="text-muted-foreground">In-app e-mail voor teambreed zichtbaarheid</p></div>
        <Button onClick={() => { setShowCompose(true); setSelectedEmail(null) }}><PenSquare className="size-4 mr-2" /> Opstellen</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-220px)]">
        <Card className="md:col-span-1 flex flex-col">
          <CardHeader className="pb-3"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input placeholder="Zoek e-mails..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div></CardHeader>
          <CardContent className="flex-1 overflow-auto p-0">
            {filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((email) => {
              const property = email.propertyId ? properties.find((p) => p.id === email.propertyId) : null
              return (
                <button key={email.id} className={`w-full text-left p-4 border-b transition-colors hover:bg-muted/50 ${selectedEmail?.id === email.id ? "bg-muted" : ""} ${!email.read ? "bg-primary/5" : ""}`} onClick={() => { setSelectedEmail(email); setShowCompose(false) }}>
                  <div className="flex items-start justify-between mb-1"><p className={`text-sm truncate ${!email.read ? "font-semibold" : ""}`}>{email.from}</p>{!email.read && <div className="size-2 rounded-full bg-primary shrink-0 mt-1.5" />}</div>
                  <p className="text-sm font-medium truncate">{email.subject}</p>
                  <p className="text-xs text-muted-foreground truncate mt-1">{email.body}</p>
                  <div className="flex items-center gap-2 mt-2">{property && <Badge variant="secondary" className="text-xs">{property.name}</Badge>}<span className="text-xs text-muted-foreground ml-auto">{new Date(email.timestamp).toLocaleDateString("nl-BE")}</span></div>
                </button>
              )
            })}
          </CardContent>
        </Card>
        <Card className="md:col-span-2 flex flex-col">
          {showCompose ? (
            <>
              <CardHeader className="border-b pb-3"><CardTitle className="text-base">Nieuwe E-mail</CardTitle></CardHeader>
              <CardContent className="flex-1 p-4 space-y-4">
                <div className="space-y-2"><label className="text-sm font-medium">Aan</label><Input placeholder="E-mailadres ontvanger" /></div>
                <div className="space-y-2"><label className="text-sm font-medium">Onderwerp</label><Input placeholder="E-mail onderwerp" /></div>
                <div className="space-y-2 flex-1"><label className="text-sm font-medium">Bericht</label><Textarea placeholder="Schrijf uw bericht..." className="min-h-[200px]" /></div>
                <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setShowCompose(false)}>Annuleren</Button><Button><Send className="size-4 mr-2" /> Versturen</Button></div>
              </CardContent>
            </>
          ) : selectedEmail ? (
            <>
              <CardHeader className="border-b pb-3">
                <CardTitle className="text-base">{selectedEmail.subject}</CardTitle>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground"><span>Van: {selectedEmail.from}</span><span>&bull;</span><span>Aan: {selectedEmail.to}</span></div>
                <span className="text-xs text-muted-foreground">{new Date(selectedEmail.timestamp).toLocaleString("nl-BE")}</span>
              </CardHeader>
              <CardContent className="flex-1 p-4"><p className="text-sm leading-relaxed whitespace-pre-wrap">{selectedEmail.body}</p></CardContent>
              <div className="border-t p-4 flex gap-2"><Button variant="outline" size="sm"><Reply className="size-4 mr-1" /> Beantwoorden</Button></div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center"><Inbox className="size-12 mx-auto mb-3 opacity-30" /><p>Selecteer een e-mail of stel een nieuwe op</p></div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
