"use client"

import { NavLink } from "react-router-dom"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Settings,
  Users,
  Calendar,
  FileText,
  LogOut,
  Menu,
  NotebookText,
  CreditCard,
  Cog,
  ChartNoAxesCombined,
} from "lucide-react"
import { useState } from "react"

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const activeLinkClass = "bg-accent text-accent-foreground"
  const defaultLinkClass = "hover:bg-muted hover:text-muted-foreground"

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  return (
    <aside className="h-screen border-r bg-background flex-shrink-0">
      <div className={`h-full flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? "w-20" : "w-64"}`}>
        <nav className="flex-1 flex flex-col p-4 space-y-1 overflow-y-hidden">
          {/* Toggle Button */}
          <Button variant="ghost" size="sm" className="self-end mb-4 p-2 rounded-full" onClick={toggleSidebar}>
            <Menu />
          </Button>

          {/* Dashboard */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive ? activeLinkClass : defaultLinkClass
              } ${isCollapsed ? "justify-center" : ""}`
            }
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className={`${isCollapsed ? "hidden" : "block"}`}>Dashboard</span>
          </NavLink>

          {/* Invoice Management */}
          <NavLink
            to="/invoice-management"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive ? activeLinkClass : defaultLinkClass
              } ${isCollapsed ? "justify-center" : ""}`
            }
          >
            <NotebookText className="h-4 w-4" />
            <span className={`${isCollapsed ? "hidden" : "block"}`}>Invoice Management</span>
          </NavLink>

          {/* PaymentProcess
          <NavLink
            to="/payment-process"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive ? activeLinkClass : defaultLinkClass
              } ${isCollapsed ? "justify-center" : ""}`
            }
          >
            <CreditCard className="h-4 w-4" />
            <span className={`${isCollapsed ? "hidden" : "block"}`}>Payment Process</span>
          </NavLink> */}


          {/* User Management */}
          {!isCollapsed ? (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b-0 px-3">
                <AccordionTrigger className="py-2 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>User Management</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0 pl-8">
                  <div className="flex flex-col space-y-1 mt-1">
                    <NavLink
                      to="/users"
                      className={({ isActive }) =>
                        `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive ? activeLinkClass : defaultLinkClass
                        }`
                      }
                    >
                      All Users
                    </NavLink>
                    <NavLink
                      to="/create"
                      className={({ isActive }) =>
                        `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive ? activeLinkClass : defaultLinkClass
                        }`
                      }
                    >
                      Create User
                    </NavLink>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-b-0 px-3">
                <AccordionTrigger className="py-2 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Content</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0 pl-8">
                  <div className="flex flex-col space-y-1 mt-1">
                    <NavLink
                      to="/posts"
                      className={({ isActive }) =>
                        `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive ? activeLinkClass : defaultLinkClass
                        }`
                      }
                    >
                      Posts
                    </NavLink>
                    <NavLink
                      to="/media"
                      className={({ isActive }) =>
                        `flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive ? activeLinkClass : defaultLinkClass
                        }`
                      }
                    >
                      Media
                    </NavLink>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <div className="flex flex-col space-y-1">
              <Button variant="ghost" size="sm" className="justify-center p-2">
                <Users className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="justify-center p-2">
                <FileText className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Calendar */}
          <NavLink
            to="/calendar"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive ? activeLinkClass : defaultLinkClass
              } ${isCollapsed ? "justify-center" : ""}`
            }
          >
            <Calendar className="h-4 w-4" />
            <span className={`${isCollapsed ? "hidden" : "block"}`}>Calendar</span>
          </NavLink>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={`w-full gap-2 ${isCollapsed ? "justify-center" : "justify-start"}`}
          >
            <LogOut className="h-4 w-4" />
            <span className={`${isCollapsed ? "hidden" : "block"}`}>Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  )
}
