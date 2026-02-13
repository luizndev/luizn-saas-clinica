"use client"

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Building2,
  CalendarDays,
  Command,
  Frame,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Stethoscope,
  UsersRound,
} from "lucide-react"
import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"

const navMainData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Agendamentos",
      url: "/appointments",
      icon: CalendarDays,
    },
    {
      title: "Médicos",
      url: "/doctors",
      icon: Stethoscope,
    },
    {
      title: "Pacientes",
      url: "/patients",
      icon: UsersRound,
    },
  ],
}

export function AppSidebar({ 
  user,
  clinic,
  ...props 
}: React.ComponentProps<typeof Sidebar> & {
  user: {
    id: string
    name: string
    email: string
    image: string
    plan: string
    trialExpiresAt?: string | Date | null
  }
  clinic: {
    id: string
    name: string
  } | null
}) {
    const isTrial = user.trialExpiresAt && new Date(user.trialExpiresAt) > new Date()

    const teams = (clinic && clinic.id) ? [{
        name: clinic.name,
        logo: Building2,
        plan: isTrial ? "Teste Grátis" : user.plan,
        id: clinic.id,
    }] : [{
        name: "Sem clínica",
        logo: Building2,
        plan: isTrial ? "Teste Grátis" : user.plan,
        id: "",
    }]

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
