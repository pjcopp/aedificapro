"use client"

import { useState } from "react"
import { Bot, Send, User, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type ChatMessage = { role: "user" | "assistant"; content: string }

const suggestions = [
  "Wat is de huidige bezettingsgraad?",
  "Welke panden hebben achterstallige betalingen?",
  "Toon tickets die dringend aandacht nodig hebben",
  "Wat is de totale maandelijkse omzet?",
  "Welke contracten lopen binnenkort af?",
  "Stel de optimale huurprijs voor het Gent pand voor",
]

const mockResponses: Record<string, string> = {
  "bezetting": "Uw huidige bezettingsgraad is 83%. Van de 6 panden zijn er 4 verhuurd, 1 beschikbaar (Loft Korenmarkt, Gent), en 1 in onderhoud (Appartement Markt Brugge).",
  "achterstallig": "Er is 1 achterstallige betaling:\n- Appartement Markt Brugge (Thomas Willems): EUR 1.310 vervallen op 1 maart 2026. Dit is 4 dagen te laat. Ik raad aan een herinnering te sturen.",
  "dringend": "Er zijn 2 tickets met hoge prioriteit:\n1. Voordeurslot klemt op Meir 78 (DRINGEND) - Slotenmaker is al ter plaatse\n2. Airco koelt niet op Place Saint-Lambert 8 (HOOG) - Nog niet toegewezen. Dupont Consulting heeft deze week vergaderingen met klanten.",
  "omzet": "Uw totale maandelijkse inkomsten uit verhuurde panden bedragen EUR 6.900:\n- Appartement Grote Markt: EUR 1.350\n- Studio Meir: EUR 950\n- Herenhuis Naamsestraat: EUR 1.800\n- Appartement Markt Brugge: EUR 1.100\n- Commercieel Pand Sint-Lambert: EUR 2.800\n\nOp jaarbasis: EUR 82.800",
  "contract": "Geen contracten lopen af binnen de komende 6 maanden. De eerstvolgende afloop is:\n- Appartement Grote Markt: 31 mei 2026 (2 maanden)\n- Studio Meir: 31 december 2026\n- Herenhuis Naamsestraat: 28 februari 2026 (reeds verstreken - verlenging nodig!)",
  "gent": "Analyse voor de buurt Korenmarkt, Gent:\n- Gebiedsgemiddelde: EUR 1.700/maand\n- Uw vraagprijs: EUR 1.650/maand (2,9% onder marktprijs)\n- Oppervlakte: 120m2 (EUR 13,75/m2)\n- Gem. buurt per m2: EUR 14,17/m2\n\nAanbeveling: U kunt de huurprijs verhogen naar EUR 1.680-1.700 en nog steeds concurrerend zijn. De 3-kamer, 2-badkamer indeling is zeer gewild in dit gebied.",
}

export function AIAssistantModule() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hallo! Ik ben uw AedificaPro AI-assistent. Ik kan u helpen met het opzoeken van pandinformatie, het analyseren van uw portefeuille en het bieden van inzichten. Wat wilt u weten?" },
  ])
  const [input, setInput] = useState("")

  const handleSend = (text?: string) => {
    const query = text || input
    if (!query.trim()) return
    setMessages((prev) => [...prev, { role: "user", content: query }])
    setInput("")
    setTimeout(() => {
      const lowerQuery = query.toLowerCase()
      let response = "Ik ga dat voor u uitzoeken. Op basis van uw portefeuillegegevens analyseer ik deze vraag en kom ik bij u terug met gedetailleerde informatie."
      for (const [key, value] of Object.entries(mockResponses)) {
        if (lowerQuery.includes(key)) { response = value; break }
      }
      setMessages((prev) => [...prev, { role: "assistant", content: response }])
    }, 800)
  }

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold tracking-tight">AI Assistent</h2><p className="text-muted-foreground">Stel vragen over uw panden en portefeuille</p></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[calc(100vh-220px)]">
        <Card className="md:col-span-1">
          <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Sparkles className="size-4 text-primary" />Snelle Vragen</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <button key={index} className="w-full text-left text-sm p-2.5 rounded-lg border transition-colors hover:bg-muted" onClick={() => handleSend(suggestion)}>{suggestion}</button>
            ))}
          </CardContent>
        </Card>
        <Card className="md:col-span-3 flex flex-col">
          <CardContent className="flex-1 overflow-auto p-4">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <Avatar className="size-8 shrink-0">
                    <AvatarFallback className={msg.role === "assistant" ? "bg-primary text-primary-foreground" : "bg-muted"}>
                      {msg.role === "assistant" ? <Bot className="size-4" /> : <User className="size-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`max-w-[75%] rounded-lg p-3 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input placeholder="Stel een vraag over uw panden..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} />
              <Button size="icon" onClick={() => handleSend()}><Send className="size-4" /></Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
