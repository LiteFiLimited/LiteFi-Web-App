"use client";

import React, { useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import NotificationDropdown from "@/app/components/NotificationDropdown";
import { useToastContext } from "@/app/components/ToastProvider";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const { success, info } = useToastContext();
  
  // Track unread count separately to avoid state update conflicts
  const [unreadCount, setUnreadCount] = useState(2);
  
  const getPageTitle = () => {
    if (pathname.includes("/loans")) return "Loans";
    if (pathname.includes("/investments")) return "Investments";
    if (pathname.includes("/wallet")) return "Wallet";
    if (pathname.includes("/profile")) return "Profile";
    return "Dashboard";
  };

  const handleLogout = () => {
    // Clear any stored authentication data (localStorage, sessionStorage, cookies, etc.)
    localStorage.clear();
    sessionStorage.clear();
    
    success("Logged out successfully", "Thank you for using LiteFi");
    
    // Redirect to login page after a short delay
    setTimeout(() => {
      router.push("/auth/login");
    }, 1500);
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
            <div className="relative">
              <button 
                ref={notificationButtonRef}
                className="p-1 relative"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <Image 
                  src="/assets/svgs/notification.svg" 
                  alt="Notification" 
                  width={38} 
                  height={38} 
                />
                {/* Notification badge - shows when there are unread notifications */}
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              <NotificationDropdown
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                triggerRef={notificationButtonRef}
                onNotificationChange={(newNotifications) => {
                  const unread = newNotifications.filter(n => !n.isRead).length;
                  setUnreadCount(unread);
                }}
                onShowToast={{ success, info }}
              />
            </div>
            <button className="p-1" onClick={handleLogout}>
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardContent>{children}</DashboardContent>;
} 