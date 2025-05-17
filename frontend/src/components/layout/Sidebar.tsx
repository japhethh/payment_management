"use client"

import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import { LayoutDashboard, Users, Calendar, LogOut, Menu, NotebookText, X, FileUser } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"


export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Handle screen resize to detect mobile
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setIsCollapsed(true)
      }
    }

    // Check on initial load
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Updated color classes for light blue theme
  const activeLinkClass = "bg-blue-200 text-blue-700"
  const defaultLinkClass = "hover:bg-blue-100 hover:text-blue-500"

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 bg-white text-black">
        <h2
          className={cn(
            "font-semibold text-lg transition-opacity duration-200",
            isCollapsed && !isMobile ? "opacity-0 hidden" : "opacity-100",
          )}
        >
          Dashboard
        </h2>
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            className="p-2 rounded-full text-blue-700 hover:bg-blue-100"
            onClick={toggleSidebar}
          >
            <Menu className="h-4 w-4" />
          </Button>
        )}
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            className="p-2 rounded-full text-blue-700 hover:bg-blue-100"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <nav className="flex-1 flex flex-col p-4 space-y-1 overflow-y-auto">
        {/* Dashboard */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive ? activeLinkClass : defaultLinkClass,
              isCollapsed && !isMobile ? "justify-center" : "",
            )
          }
          onClick={() => isMobile && setIsOpen(false)}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span className={cn(isCollapsed && !isMobile ? "hidden" : "block")}>Dashboard</span>
        </NavLink>

        {/* Invoice Management */}
        <NavLink
          to="/invoice-management"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive ? activeLinkClass : defaultLinkClass,
              isCollapsed && !isMobile ? "justify-center" : "",
            )
          }
          onClick={() => isMobile && setIsOpen(false)}
        >
          <NotebookText className="h-4 w-4" />
          <span className={cn(isCollapsed && !isMobile ? "hidden" : "block")}>Invoice Management</span>
        </NavLink>

        {/* Staff Management */}
        <NavLink
          to="/staff"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive ? activeLinkClass : defaultLinkClass,
              isCollapsed && !isMobile ? "justify-center" : "",
            )
          }
          onClick={() => isMobile && setIsOpen(false)}
        >
          <Users className="h-4 w-4" />
          <span className={cn(isCollapsed && !isMobile ? "hidden" : "block")}>Staff</span>
        </NavLink>
        {/* Staff Management */}
        <NavLink
          to="/students"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive ? activeLinkClass : defaultLinkClass,
              isCollapsed && !isMobile ? "justify-center" : "",
            )
          }
          onClick={() => isMobile && setIsOpen(false)}
        >
          <FileUser className="h-4 w-4" />
          <span className={cn(isCollapsed && !isMobile ? "hidden" : "block")}>Students</span>
        </NavLink>


        {/* User Management - Accordion for expanded view */}
        {!isCollapsed || isMobile ? (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTrigger className="py-2 px-3 hover:no-underline rounded-md hover:bg-blue-100 hover:text-blue-700">
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
                      cn(
                        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive ? activeLinkClass : defaultLinkClass,
                      )
                    }
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    All Users
                  </NavLink>
                  <NavLink
                    to="/accounts"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive ? activeLinkClass : defaultLinkClass,
                      )
                    }
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    Other Department
                  </NavLink>
                  <NavLink
                    to="/create"
                    className={({ isActive }) =>
                      cn(
                        "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive ? activeLinkClass : defaultLinkClass,
                      )
                    }
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    Create User
                  </NavLink>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          // Icon-only view for collapsed sidebar with tooltip
          <div className="relative group">
            <Button variant="ghost" size="sm" className="w-full justify-center p-2 rounded-md">
              <Users className="h-4 w-4" />
            </Button>

            {/* Tooltip on hover when collapsed */}
            <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-50">
              <div className="bg-white shadow-md rounded-md py-2 px-2 text-sm border border-blue-100">
                <div className="font-medium mb-1 text-blue-700">User Management</div>
                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive ? activeLinkClass : defaultLinkClass,
                    )
                  }
                >
                  All Users
                </NavLink>
                <NavLink
                  to="/accounts"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive ? activeLinkClass : defaultLinkClass,
                    )
                  }
                >
                  Other Department
                </NavLink>
                <NavLink
                  to="/create"
                  className={({ isActive }) =>
                    cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive ? activeLinkClass : defaultLinkClass,
                    )
                  }
                >
                  Create User
                </NavLink>
              </div>
            </div>
          </div>
        )}

        {/* Calendar */}
        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive ? activeLinkClass : defaultLinkClass,
              isCollapsed && !isMobile ? "justify-center" : "",
              isMobile ? "md:flex hidden" : "",
            )
          }
          onClick={() => isMobile && setIsOpen(false)}
        >
          <Calendar className="h-4 w-4" />
          <span className={cn(isCollapsed && !isMobile ? "hidden" : "block")}>Calendar</span>
        </NavLink>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-blue-200">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full gap-2 text-blue-700 hover:bg-blue-100 hover:text-blue-800",
            isCollapsed && !isMobile ? "justify-center" : "justify-start",
          )}
        >
          <LogOut className="h-4 w-4" />
          <span className={cn(isCollapsed && !isMobile ? "hidden" : "block")}>Logout</span>
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Trigger - Only visible on mobile */}
      {isMobile && (
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Mobile Sidebar */}
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="left" className="p-0 w-[240px] bg-white border-r border-blue-200">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      ) : (
        // Desktop Sidebar
        <aside className="h-screen border-r border-blue-200 bg-white flex-shrink-0">
          <div
            className={cn(
              "h-full flex flex-col transition-all duration-300 ease-in-out",
              isCollapsed ? "w-16" : "w-64",
            )}
          >
            <SidebarContent />
          </div>
        </aside>
      )}
    </>
  )
}
