"use client"

import { usePathname } from "next/navigation"

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/appointments": "Agendamentos",
  "/doctors": "Médicos",
  "/patients": "Pacientes",
  "/plans": "Planos",
  "/clinic-form": "Clínica",
  "/clinic": "Clínica",
}

const mainNavPaths = ["/dashboard", "/appointments", "/doctors", "/patients"]

export function useBreadcrumbs() {
  const pathname = usePathname()
  
  const paths = pathname.split("/").filter(Boolean)
  
  let breadcrumbs = paths.map((path, index) => {
    const url = `/${paths.slice(0, index + 1).join("/")}`
    return {
      label: breadcrumbMap[url] || path.charAt(0).toUpperCase() + path.slice(1),
      href: url,
      isLast: index === paths.length - 1,
    }
  })

  // Filter out "authenticaded"
  breadcrumbs = breadcrumbs.filter(b => b.label.toLowerCase() !== "authenticaded")

  // Add "Menu Principal" if it's one of the main navigation items
  const currentUrl = `/${paths.join("/")}`
  if (mainNavPaths.some(p => currentUrl.startsWith(p))) {
    breadcrumbs = [
      { label: "Menu Principal", href: "#", isLast: false },
      ...breadcrumbs
    ]
  }

  return breadcrumbs
}
