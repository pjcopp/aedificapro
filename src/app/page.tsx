"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopHeader } from "@/components/top-header"
import { DotPattern } from "@/components/dot-pattern"
import { DashboardModule } from "@/components/modules/dashboard"
import { PropertiesModule } from "@/components/modules/properties"
import { TenantsModule } from "@/components/modules/tenants"
import { ContractsModule } from "@/components/modules/contracts"
import { TicketsModule } from "@/components/modules/tickets"
import { InvoicingModule } from "@/components/modules/invoicing"
import { MessagesModule } from "@/components/modules/messages"
import { AnalyticsModule } from "@/components/modules/analytics"
import { InterventionsModule } from "@/components/modules/interventions"
import { WorkersModule } from "@/components/modules/workers-list"
import { EmailModule } from "@/components/modules/email-module"
import { PropertyMapModule } from "@/components/modules/property-map"
import { TeamModule } from "@/components/modules/team"
import { AIAssistantModule } from "@/components/modules/ai-assistant"
import { OwnersModule } from "@/components/modules/owners"
import { CandidatesModule } from "@/components/modules/candidates"

const moduleLabels: Record<string, string> = {
  dashboard: "Dashboard",
  properties: "Panden",
  owners: "Verhuurders",
  tenants: "Huurders",
  candidates: "Kandidaten",
  map: "Pandenkaart",
  contracts: "Contracten",
  tickets: "Tickets",
  invoicing: "Facturatie",
  interventions: "Interventies",
  messages: "Berichten",
  email: "E-mail",
  analytics: "Analyse",
  "ai-assistant": "AI Assistent",
  workers: "Vaklui",
  team: "Team & Instellingen",
}

export default function Home() {
  const [activeModule, setActiveModule] = useState("dashboard")
  const [customerLogo, setCustomerLogo] = useState<string | null>(null)

  const renderModule = () => {
    switch (activeModule) {
      case "dashboard": return <DashboardModule />
      case "properties": return <PropertiesModule />
      case "tenants": return <TenantsModule />
      case "owners": return <OwnersModule />
      case "candidates": return <CandidatesModule />
      case "map": return <PropertyMapModule />
      case "contracts": return <ContractsModule />
      case "tickets": return <TicketsModule />
      case "invoicing": return <InvoicingModule />
      case "interventions": return <InterventionsModule />
      case "messages": return <MessagesModule />
      case "email": return <EmailModule />
      case "analytics": return <AnalyticsModule />
      case "ai-assistant": return <AIAssistantModule />
      case "workers": return <WorkersModule />
      case "team": return <TeamModule onLogoChange={setCustomerLogo} />
      default: return <DashboardModule />
    }
  }

  return (
    <SidebarProvider>
      <DotPattern />
      <AppSidebar
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        customerLogo={customerLogo}
        onLogoChange={setCustomerLogo}
      />
      <SidebarInset className="!bg-transparent">
        <TopHeader
          activeModule={activeModule}
          moduleLabel={moduleLabels[activeModule] || "Dashboard"}
          customerLogo={customerLogo}
          onModuleChange={setActiveModule}
        />
        <main className="relative z-10 flex-1 overflow-auto p-6">
          {renderModule()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
