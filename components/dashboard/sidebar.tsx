"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

// Import icons
import {
  LayoutDashboard,
  Wallet,
  History,
  CreditCard,
  User,
  LogOut,
  HelpCircle,
  MessagesSquare,
} from "lucide-react";

interface DashboardSidebarProps {
  className?: string;
}

export default function DashboardSidebar({ className }: DashboardSidebarProps) {
  const pathname = usePathname();
  
  const menuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "/assets/svgs/dashboard.svg",
    },
    {
      title: "Loans",
      href: "/dashboard/loans",
      icon: "/assets/svgs/loans.svg",
    },
    {
      title: "Investments",
      href: "/dashboard/investments",
      icon: "/assets/svgs/investments.svg",
    },
    {
      title: "Wallet",
      href: "/dashboard/wallet",
      icon: "/assets/svgs/wallet.svg",
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: "/assets/svgs/profile.svg",
    },
  ];

  return (
    <Sidebar className="bg-white" style={{ backgroundColor: 'white' }}>
      <SidebarHeader className="h-16 flex items-center px-6 pt-2 border-b border-transparent">
        <Link href="/dashboard" className="flex items-center justify-start w-full py-3">
          <Image
            src="/assets/svgs/logoo.svg"
            alt="LiteFi Logo"
            width={80}
            height={30}
            priority
            className="object-left"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent className="py-4 bg-white">
        <SidebarMenu className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <SidebarMenuItem key={item.title} className="w-[calc(100%-16px)] mx-2">
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive}
                  className={`${isActive ? "sidebar-item-active !rounded-none" : "hover:rounded-none"}`}
                  style={{ width: '100%' }}
                >
                  <Link href={item.href} className="flex items-center gap-2">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={20}
                      height={20}
                    />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
          
          <SidebarMenuItem className="w-[calc(100%-16px)] mx-2">
            <SidebarMenuButton 
              asChild
              className="hover:rounded-none"
              style={{ width: '100%' }}
            >
              <Link href="/auth/login" className="flex items-center gap-2">
                <Image
                  src="/assets/svgs/sign-out.svg"
                  alt="Sign Out"
                  width={20}
                  height={20}
                />
                <span>Sign Out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="p-6 border-t border-transparent mt-auto bg-white">
        <div className="space-y-4 bg-gray-50 p-4">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/svgs/customer-service.svg"
              alt="Customer Service"
              width={24}
              height={24}
            />
            <h4 className="text-sm font-medium">Need Support?</h4>
          </div>
          <p className="text-xs text-muted-foreground">
            Get in contact with one of our experts to get support.
          </p>
          <button className="w-full py-2 px-4 text-sm bg-white border border-gray-200 text-center hover:bg-gray-50 transition-colors">
            Contact support
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
} 