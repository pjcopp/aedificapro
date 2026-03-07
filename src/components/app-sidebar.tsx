"use client"

import { useCallback } from "react"
import {
  Building2,
  LayoutDashboard,
  Users,
  FileText,
  FileBarChart,
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
  useSidebar,
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
  { id: "contract-dashboard", label: "Contract Dashboard", icon: FileBarChart },
  { id: "tickets", label: "Tickets", icon: Ticket, badge: 4 },
  { id: "invoicing", label: "Betalingen", icon: Receipt },
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
  { id: "contracts", label: "Templates", icon: FileText },
]

type AppSidebarProps = {
  activeModule: string
  onModuleChange: (moduleId: string) => void
  customerLogo?: string | null
  hoverExpand?: boolean
}

export function AppSidebar({ activeModule, onModuleChange, customerLogo, hoverExpand = false }: AppSidebarProps) {
  const { toggleSidebar, state } = useSidebar()

  const handleMouseEnter = useCallback(() => {
    if (hoverExpand && state === "collapsed") {
      toggleSidebar()
    }
  }, [hoverExpand, state, toggleSidebar])

  const handleMouseLeave = useCallback(() => {
    if (hoverExpand && state === "expanded") {
      toggleSidebar()
    }
  }, [hoverExpand, state, toggleSidebar])

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
    <Sidebar
      collapsible="icon"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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

      <SidebarFooter className="py-3">
        <div className="px-3 text-center">
          <p className="text-[10px] text-muted-foreground/60 group-data-[collapsible=icon]:hidden">&copy; 2026 AedificaPro</p>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
