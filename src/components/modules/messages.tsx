"use client"

import { useState } from "react"
import { Search, Send, Building2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { messages, properties } from "@/lib/mock-data"

export function MessagesModule() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [newMessage, setNewMessage] = useState("")

  const propertyConversations = properties
    .filter((p) => p.tenant)
    .map((p) => {
      const propertyMessages = messages.filter((m) => m.propertyId === p.id)
      const unreadCount = propertyMessages.filter((m) => !m.read).length
      const lastMessage = propertyMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
      return { property: p, messages: propertyMessages, unreadCount, lastMessage }
    })
    .filter((c) => c.property.name.toLowerCase().includes(search.toLowerCase()) || c.property.address.toLowerCase().includes(search.toLowerCase()))

  const selectedConversation = selectedPropertyId ? propertyConversations.find((c) => c.property.id === selectedPropertyId) : null

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold tracking-tight">Berichten</h2><p className="text-muted-foreground">Pandspecifieke gesprekken</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-220px)]">
        <Card className="md:col-span-1 flex flex-col">
          <CardHeader className="pb-3">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input placeholder="Zoek panden..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0">
            {propertyConversations.map((conv) => (
              <button key={conv.property.id} className={`w-full flex items-start gap-3 p-4 text-left border-b transition-colors hover:bg-muted/50 ${selectedPropertyId === conv.property.id ? "bg-muted" : ""}`} onClick={() => setSelectedPropertyId(conv.property.id)}>
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 shrink-0"><Building2 className="size-5 text-primary" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between"><p className="font-medium text-sm truncate">{conv.property.name}</p>{conv.unreadCount > 0 && <Badge className="ml-2 shrink-0">{conv.unreadCount}</Badge>}</div>
                  <p className="text-xs text-muted-foreground truncate">{conv.property.tenant?.name}</p>
                  {conv.lastMessage && <p className="text-xs text-muted-foreground truncate mt-1">{conv.lastMessage.content}</p>}
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
        <Card className="md:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              <CardHeader className="border-b pb-3">
                <CardTitle className="text-base">{selectedConversation.property.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{selectedConversation.property.tenant?.name}</p>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-4">
                <div className="space-y-4">
                  {selectedConversation.messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.senderRole === "owner" ? "flex-row-reverse" : ""}`}>
                      <Avatar className="size-8 shrink-0"><AvatarFallback className="text-xs bg-primary/10">{msg.sender.split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback></Avatar>
                      <div className={`max-w-[70%] rounded-lg p-3 ${msg.senderRole === "owner" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.senderRole === "owner" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{new Date(msg.timestamp).toLocaleString("nl-BE")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Textarea placeholder="Typ een bericht..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="min-h-[40px] max-h-[120px]" rows={1} />
                  <Button size="icon" className="shrink-0"><Send className="size-4" /></Button>
                </div>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center"><Building2 className="size-12 mx-auto mb-3 opacity-30" /><p>Selecteer een pand om berichten te bekijken</p></div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
