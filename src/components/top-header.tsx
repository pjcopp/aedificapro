"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import {
  Search,
  Bell,
  Settings,
  Sun,
  Moon,
  ChevronDown,
  LogOut,
  User,
  Camera,
  Headphones,
  Info,
  BookOpen,
  PanelLeft,
  PanelLeftClose,
  MousePointerClick,
  ImageIcon,
  LayoutDashboard,
  Building2,
  Briefcase,
  Users,
  UserPlus,
  MapPin,
  FileBarChart,
  Ticket,
  Receipt,
  Wrench,
  HardHat,
  MessageSquare,
  Mail,
  BarChart3,
  Bot,
  UserCog,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useSidebar } from "@/components/ui/sidebar"
import { appUpdates, appManuals } from "@/lib/mock-data"

type TopHeaderProps = {
  activeModule: string
  moduleLabel: string
  customerLogo?: string | null
  userPhoto?: string | null
  onUserPhotoChange?: (url: string | null) => void
  onModuleChange: (id: string) => void
  onLogoChange?: (logo: string | null) => void
  hoverExpand?: boolean
  onHoverExpandChange?: (value: boolean) => void
}

const ticketCategories = [
  { value: "bug", label: "Bug / Fout" },
  { value: "feature", label: "Functie Aanvraag" },
  { value: "account", label: "Account / Login" },
  { value: "performance", label: "Prestatie / Snelheid" },
  { value: "data", label: "Data / Import / Export" },
  { value: "integration", label: "Integratie / API" },
  { value: "other", label: "Overig" },
]

const ticketPriorities = [
  { value: "low", label: "Laag" },
  { value: "medium", label: "Gemiddeld" },
  { value: "high", label: "Hoog" },
  { value: "urgent", label: "Dringend" },
]

const ticketModules = [
  { value: "dashboard", label: "Dashboard" },
  { value: "properties", label: "Panden" },
  { value: "tenants", label: "Huurders" },
  { value: "contracts", label: "Contracten" },
  { value: "tickets", label: "Tickets" },
  { value: "invoicing", label: "Betalingen" },
  { value: "analytics", label: "Analyse" },
  { value: "messages", label: "Berichten" },
  { value: "team", label: "Team & Instellingen" },
  { value: "other", label: "Overig / Algemeen" },
]

const moduleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  properties: Building2,
  owners: Briefcase,
  tenants: Users,
  candidates: UserPlus,
  map: MapPin,
  "contract-dashboard": FileBarChart,
  contracts: FileText,
  tickets: Ticket,
  invoicing: Receipt,
  interventions: Wrench,
  workers: HardHat,
  messages: MessageSquare,
  email: Mail,
  analytics: BarChart3,
  "ai-assistant": Bot,
  team: UserCog,
}

const updateTypeDot: Record<string, string> = {
  feature: "bg-blue-500",
  improvement: "bg-green-500",
  bugfix: "bg-orange-500",
}

export function TopHeader({ activeModule, moduleLabel, customerLogo, userPhoto, onUserPhotoChange, onModuleChange, onLogoChange, hoverExpand, onHoverExpandChange }: TopHeaderProps) {
  const { theme, setTheme } = useTheme()
  const { toggleSidebar, state: sidebarState } = useSidebar()
  const [supportOpen, setSupportOpen] = useState(false)
  const [logoDialogOpen, setLogoDialogOpen] = useState(false)
  const [logoUrl, setLogoUrl] = useState(customerLogo || "")

  // Group manuals by category
  const manualsByCategory = appManuals.reduce<Record<string, typeof appManuals>>((acc, manual) => {
    if (!acc[manual.category]) acc[manual.category] = []
    acc[manual.category].push(manual)
    return acc
  }, {})

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-sm shadow-md">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left - Logo + Breadcrumb */}
        <div className="flex items-center gap-3">
          {customerLogo && (
            <img src={customerLogo} alt="Klant Logo" className="h-6 object-contain dark:brightness-0 dark:invert" />
          )}

          {customerLogo && <Separator orientation="vertical" className="!h-6 hidden sm:block" />}

          {/* Module Breadcrumb */}
          {(() => {
            const ModIcon = moduleIcons[activeModule] || LayoutDashboard
            return (
              <div className="hidden sm:flex items-center gap-2">
                <ModIcon className="size-5 text-primary" />
                <span className="text-base font-semibold">{moduleLabel}</span>
              </div>
            )
          })()}
        </div>

        {/* Right - Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <Button variant="ghost" size="icon" className="size-8">
            <Search className="size-4" />
          </Button>

          {/* Support Ticket */}
          <Dialog open={supportOpen} onOpenChange={setSupportOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <Headphones className="size-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Software Supportticket</DialogTitle>
                <DialogDescription>
                  Heeft u een probleem met AedificaPro? Beschrijf het hieronder en ons team helpt u verder.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Onderwerp</label>
                  <Input placeholder="Bijv. Foutmelding bij opslaan contract" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Categorie</label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecteer categorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {ticketCategories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Module</label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Waar treedt het op?" />
                      </SelectTrigger>
                      <SelectContent>
                        {ticketModules.map((mod) => (
                          <SelectItem key={mod.value} value={mod.value}>
                            {mod.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Beschrijving</label>
                  <Textarea placeholder="Beschrijf stap voor stap wat er mis gaat..." className="min-h-[100px]" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Prioriteit</label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecteer prioriteit" />
                    </SelectTrigger>
                    <SelectContent>
                      {ticketPriorities.map((pri) => (
                        <SelectItem key={pri.value} value={pri.value}>
                          {pri.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Screenshot toevoegen</label>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      const input = document.createElement("input")
                      input.type = "file"
                      input.accept = "image/*"
                      input.click()
                    }}
                  >
                    <ImageIcon className="mr-2 size-4" />
                    Schermafbeelding Kiezen
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSupportOpen(false)}>
                  Annuleren
                </Button>
                <Button onClick={() => setSupportOpen(false)}>
                  Ticket Versturen
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Updates Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <Info className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Recente Updates</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {appUpdates.map((update) => (
                <DropdownMenuItem key={update.id} className="flex items-start gap-3 py-3 cursor-default">
                  <span className={`mt-1.5 size-2 shrink-0 rounded-full ${updateTypeDot[update.type]}`} />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-medium leading-tight">{update.title}</span>
                    <span className="text-xs text-muted-foreground leading-snug">{update.description}</span>
                    <span className="text-[10px] text-muted-foreground/70 mt-0.5">{update.date}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Manuals Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <BookOpen className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel>Handleidingen</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(manualsByCategory).map(([category, manuals]) => (
                <DropdownMenuGroup key={category}>
                  <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                    {category}
                  </DropdownMenuLabel>
                  {manuals.map((manual) => (
                    <DropdownMenuItem key={manual.id} className="flex flex-col items-start gap-0.5 py-2 cursor-pointer">
                      <span className="text-sm font-medium">{manual.title}</span>
                      <span className="text-xs text-muted-foreground">{manual.description}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="size-8 relative" onClick={() => onModuleChange("tickets")}>
            <Bell className="size-4" />
            <span className="absolute -top-0.5 -right-0.5 size-4 text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center">4</span>
          </Button>

          {/* Settings Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <Settings className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Instellingen</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Zijbalk</DropdownMenuLabel>
                <DropdownMenuItem onClick={toggleSidebar}>
                  {sidebarState === "collapsed" ? <PanelLeft className="mr-2 size-4" /> : <PanelLeftClose className="mr-2 size-4" />}
                  {sidebarState === "collapsed" ? "Zijbalk uitklappen" : "Zijbalk inklappen"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onHoverExpandChange?.(!hoverExpand)}>
                  <MousePointerClick className="mr-2 size-4" />
                  <div className="flex items-center justify-between flex-1">
                    <span>Hover uitklappen</span>
                    <Switch
                      checked={hoverExpand || false}
                      onCheckedChange={(v) => onHoverExpandChange?.(v)}
                      className="scale-75"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Weergave</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => { setLogoUrl(customerLogo || ""); setLogoDialogOpen(true) }}>
                  <ImageIcon className="mr-2 size-4" />
                  Logo Wijzigen
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onModuleChange("team")}>
                  <User className="mr-2 size-4" />
                  Team & Instellingen
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Logo Wijzigen Dialog */}
          <Dialog open={logoDialogOpen} onOpenChange={setLogoDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Logo Wijzigen</DialogTitle>
                <DialogDescription>
                  Voer een URL in of upload een afbeelding als bedrijfslogo.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {logoUrl && (
                  <div className="flex justify-center rounded-lg border border-dashed border-border p-4 bg-muted/30">
                    <img src={logoUrl} alt="Logo preview" className="h-12 object-contain" />
                  </div>
                )}
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Logo URL</label>
                  <Input
                    placeholder="https://voorbeeld.be/logo.png"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Of upload een bestand</label>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      const input = document.createElement("input")
                      input.type = "file"
                      input.accept = "image/*"
                      input.onchange = (ev) => {
                        const file = (ev.target as HTMLInputElement).files?.[0]
                        if (file) setLogoUrl(URL.createObjectURL(file))
                      }
                      input.click()
                    }}
                  >
                    <ImageIcon className="mr-2 size-4" />
                    Afbeelding Kiezen
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setLogoDialogOpen(false)}>
                  Annuleren
                </Button>
                {customerLogo && (
                  <Button variant="destructive" onClick={() => { onLogoChange?.(null); setLogoDialogOpen(false) }}>
                    Verwijderen
                  </Button>
                )}
                <Button onClick={() => { onLogoChange?.(logoUrl || null); setLogoDialogOpen(false) }}>
                  Opslaan
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Separator orientation="vertical" className="!h-6" />

          {/* Theme Toggle */}
          <div className="flex items-center gap-1.5">
            <Sun className="size-3.5 text-muted-foreground" />
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              className="scale-75"
            />
            <Moon className="size-3.5 text-muted-foreground" />
          </div>

          <Separator orientation="vertical" className="!h-6" />

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 gap-2 px-2">
                <div className="relative group">
                  <Avatar className="size-7">
                    {userPhoto ? <AvatarImage src={userPhoto} alt="Sarah van Dijk" /> : null}
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">SD</AvatarFallback>
                  </Avatar>
                </div>
                <div className="hidden md:flex flex-col text-left text-xs leading-tight">
                  <span className="font-semibold">Sarah van Dijk</span>
                  <span className="text-muted-foreground">Beheerder</span>
                </div>
                <ChevronDown className="size-3 text-muted-foreground hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => {
                const input = document.createElement("input")
                input.type = "file"
                input.accept = "image/*"
                input.onchange = (ev) => {
                  const file = (ev.target as HTMLInputElement).files?.[0]
                  if (file) onUserPhotoChange?.(URL.createObjectURL(file))
                }
                input.click()
              }}>
                <Camera className="mr-2 size-4" />
                Profielfoto Wijzigen
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onModuleChange("team")}>
                <User className="mr-2 size-4" />
                Mijn Profiel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onModuleChange("team")}>
                <Settings className="mr-2 size-4" />
                Instellingen
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 size-4" />
                Uitloggen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
