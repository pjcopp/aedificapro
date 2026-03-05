"use client"

import {
  Building2,
  LayoutDashboard,
  Users,
  FileText,
  Ticket,
  Receipt,
  MessageSquare,
  BarChart3,
  Wrench,
  HardHat,
  Mail,
  MapPin,
  UserCog,
  Bot,
  Building,
  Settings,
  Briefcase,
  UserPlus,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

type NavItem = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

const mainNav: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "properties", label: "Panden", icon: Building2 },
  { id: "owners", label: "Verhuurders", icon: Briefcase },
  { id: "tenants", label: "Huurders", icon: Users },
  { id: "candidates", label: "Kandidaten", icon: UserPlus },
  { id: "map", label: "Pandenkaart", icon: MapPin },
]

const managementNav: NavItem[] = [
  { id: "contracts", label: "Contracten", icon: FileText },
  { id: "tickets", label: "Tickets", icon: Ticket, badge: 4 },
  { id: "invoicing", label: "Facturatie", icon: Receipt },
  { id: "interventions", label: "Interventies", icon: Wrench },
  { id: "workers", label: "Vaklui", icon: HardHat },
]

const communicationNav: NavItem[] = [
  { id: "messages", label: "Berichten", icon: MessageSquare, badge: 3 },
  { id: "email", label: "E-mail", icon: Mail, badge: 1 },
]

const insightsNav: NavItem[] = [
  { id: "analytics", label: "Analyse", icon: BarChart3 },
  { id: "ai-assistant", label: "AI Assistent", icon: Bot },
]

const adminNav: NavItem[] = [
  { id: "team", label: "Team & Instellingen", icon: UserCog },
]

type AppSidebarProps = {
  activeModule: string
  onModuleChange: (moduleId: string) => void
  customerLogo?: string | null
  onLogoChange?: (logo: string | null) => void
}

export function AppSidebar({ activeModule, onModuleChange, customerLogo, onLogoChange }: AppSidebarProps) {
  const renderGroup = (label: string, items: NavItem[]) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                isActive={activeModule === item.id}
                onClick={() => onModuleChange(item.id)}
                tooltip={item.label}
              >
                <item.icon />
                <span>{item.label}</span>
              </SidebarMenuButton>
              {item.badge ? (
                <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
              ) : null}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" onClick={() => onModuleChange("dashboard")}>
              {customerLogo ? (
                <img src={customerLogo} alt="Logo" className="h-6 dark:invert" />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Building className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">AedificaPro</span>
                    <span className="truncate text-xs text-muted-foreground">Pandenbeheer</span>
                  </div>
                </div>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {renderGroup("Overzicht", mainNav)}
        <SidebarSeparator />
        {renderGroup("Beheer", managementNav)}
        <SidebarSeparator />
        {renderGroup("Communicatie", communicationNav)}
        <SidebarSeparator />
        {renderGroup("Inzichten", insightsNav)}
        <SidebarSeparator />
        {renderGroup("Administratie", adminNav)}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Instellingen"
              onClick={() => {
                const url = prompt("Voer de URL van uw logo in:", customerLogo || "")
                if (url !== null) onLogoChange?.(url || null)
              }}
            >
              <Settings />
              <span>Logo Wijzigen</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
