"use client";
import SideBarMedia from "@/../components/ui/sideBarMedia"
import SideBarDesktop from "@/../components/ui/sideBarDesktop"
import { useState } from "react";

export default function Watch() {

  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#FAF3E0]">
      <SideBarMedia sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <SideBarDesktop />

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 bg-red-100">
              <p>hello world</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}