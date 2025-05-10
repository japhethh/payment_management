"use client"

import { Outlet } from "react-router-dom"

import { useState, useEffect } from "react"
import BottomNav from "./bottom-nav"
import Header from "./Header"
import Sidebar from "./Sidebar"

export default function MainLayout() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check on initial load
    checkIfMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4 pt-12 md:pt-4 pb-20 md:pb-4">
          <Outlet />
        </main>
        {isMobile && <BottomNav />}
      </div>
    </div>
  )
}
