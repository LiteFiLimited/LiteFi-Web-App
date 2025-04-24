"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/dashboard/sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const getPageTitle = () => {
    if (pathname.includes("/loans")) return "Loans";
    if (pathname.includes("/investments")) return "Investments";
    if (pathname.includes("/wallet")) return "Wallet";
    if (pathname.includes("/profile")) return "Profile";
    return "Dashboard";
  };

  const title = getPageTitle();

  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset className="bg-gray-50">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 bg-white">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1">
              <Image 
                src="/assets/svgs/support.svg" 
                alt="Support" 
                width={38} 
                height={38} 
              />
            </button>
            <button className="p-1">
              <Image 
                src="/assets/svgs/notification.svg" 
                alt="Notification" 
                width={38} 
                height={38} 
              />
            </button>
            <button className="p-1">
              <Image 
                src="/assets/svgs/logout.svg" 
                alt="Logout" 
                width={38} 
                height={38} 
              />
            </button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 