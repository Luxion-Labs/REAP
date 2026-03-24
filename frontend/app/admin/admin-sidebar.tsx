"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
  Building,
  FileText,
  PieChart,
  ArrowRightLeft,
  ShieldCheck,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  isActive?: boolean
}

const adminItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Properties",
    url: "/admin/properties",
    icon: Building,
  },
  {
    title: "Waitlist",
    url: "/admin/waitlist",
    icon: Users,
  },
  {
    title: "Messages",
    url: "/admin/messages",
    icon: MessageSquare,
  },
  {
    title: "Registration",
    url: "/admin/registration",
    icon: FileText,
  },
  {
    title: "Tokenization",
    url: "/admin/tokenization",
    icon: PieChart,
  },
  {
    title: "Transfers",
    url: "/admin/transfers",
    icon: ArrowRightLeft,
  },
  {
    title: "Verification",
    url: "/admin/verification",
    icon: ShieldCheck,
  },
]

const settingsItems: NavItem[] = [
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
]

import { ReapLogo } from "@/components/custom/reap-logo"

export function AdminSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()
  const [settingsOpen, setSettingsOpen] = React.useState(true)

  const isCollapsed = state === "collapsed"

  return (
    <Sidebar 
      variant="sidebar"
      collapsible="icon"
      className="border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-[#2a2a2a] hidden md:flex"
      style={{
        "--sidebar-width": "16rem",
        "--sidebar-width-icon": "4.5rem",
      } as React.CSSProperties}
    >
      {/* Header with Logo and Trigger */}
      <SidebarHeader className="h-16 border-b border-slate-200 dark:border-slate-700">
        {isCollapsed ? (
          <div className="flex items-center justify-between gap-2 px-2">
            <ReapLogo size={24} className="shrink-0" />
            <SidebarTrigger className="h-6 w-6" />
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 px-8">
            <div className="flex items-center gap-3 flex-1 justify-center">
              <ReapLogo size={32} className="shrink-0" />
              <span className="font-bold text-lg leading-tight text-slate-800 dark:text-slate-100 uppercase tracking-widest">REAP</span>
            </div>
            <SidebarTrigger />
          </div>
        )}
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="bg-white dark:bg-[#2a2a2a]">
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="text-slate-500 dark:text-slate-400">Management</SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className={cn(
              isCollapsed && "flex flex-col items-center justify-center"
            )}>
              {adminItems.map((item) => {
                const Icon = item.icon
                // Only highlight dashboard for exact /admin, not for /admin/*
                const isActive = item.url === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.url || pathname.startsWith(item.url + "/")
                return (
                  <SidebarMenuItem key={item.url} className={cn(
                    isCollapsed && "w-full flex justify-center"
                  )}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800",
                        isActive && "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100",
                        isCollapsed && "justify-center"
                      )}
                    >
                      <Link href={item.url}>
                        <Icon className="w-4 h-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Section */}
        {!isCollapsed && (
          <SidebarGroup>
            <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
              <SidebarGroupLabel asChild>
              <CollapsibleTrigger className="flex w-full items-center justify-between text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform",
                      settingsOpen && "rotate-180"
                    )}
                  />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {settingsItems.map((item) => {
                      const isActive = pathname === item.url || pathname.startsWith(item.url + "/")
                      return (
                        <SidebarMenuItem key={item.url}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            className={cn(
                              "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 pl-8",
                              isActive && "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                            )}
                          >
                            <Link href={item.url}>
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-[#2a2a2a]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Link href="/">
                <LogOut className="w-4 h-4" />
                {!isCollapsed && <span>Logout</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
