"use client"

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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"

type TopHeaderProps = {
  activeModule: string
  moduleLabel: string
  customerLogo?: string | null
  onModuleChange: (id: string) => void
}

export function TopHeader({ activeModule, moduleLabel, customerLogo, onModuleChange }: TopHeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-sm shadow-md">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left - Sidebar trigger + Logo */}
        <div className="flex items-center gap-3">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="!h-6" />

          {customerLogo && (
            <img src={customerLogo} alt="Klant Logo" className="h-6 object-contain dark:brightness-0 dark:invert" />
          )}

          <Separator orientation="vertical" className="!h-6 hidden sm:block" />

          {/* Module Breadcrumb */}
          <span className="text-sm font-medium text-muted-foreground hidden sm:inline">{moduleLabel}</span>
        </div>

        {/* Right - Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search */}
          <Button variant="ghost" size="icon" className="size-8">
            <Search className="size-4" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="size-8 relative" onClick={() => onModuleChange("tickets")}>
            <Bell className="size-4" />
            <span className="absolute -top-0.5 -right-0.5 size-4 text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center">4</span>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon" className="size-8" onClick={() => onModuleChange("team")}>
            <Settings className="size-4" />
          </Button>

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
                <Avatar className="size-7">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">SD</AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col text-left text-xs leading-tight">
                  <span className="font-semibold">Sarah van Dijk</span>
                  <span className="text-muted-foreground">Beheerder</span>
                </div>
                <ChevronDown className="size-3 text-muted-foreground hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
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
