"use client"

import { NavLink } from "react-router-dom"
import { LayoutDashboard, Users, NotebookText } from "lucide-react"

export default function BottomNav() {
  const activeLinkClass = "text-primary"
  const defaultLinkClass = "text-muted-foreground"

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-40 md:hidden">
      <div className="flex justify-around items-center h-16">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full ${isActive ? activeLinkClass : defaultLinkClass}`
          }
          end
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-xs mt-1">Dashboard</span>
        </NavLink>

        <NavLink
          to="/invoice-management"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full ${isActive ? activeLinkClass : defaultLinkClass}`
          }
        >
          <NotebookText className="h-5 w-5" />
          <span className="text-xs mt-1">Invoices</span>
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full ${isActive ? activeLinkClass : defaultLinkClass}`
          }
        >
          <Users className="h-5 w-5" />
          <span className="text-xs mt-1">Users</span>
        </NavLink>


      </div>
    </div>
  )
}
