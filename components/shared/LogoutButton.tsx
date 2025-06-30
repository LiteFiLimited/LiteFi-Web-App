"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { authApi } from "@/lib/api";
import { logout } from "@/lib/auth";
import { useState } from "react";
import { useToastContext } from "@/app/components/ToastProvider";

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  className?: string;
}

export default function LogoutButton({ 
  variant = "ghost", 
  size = "default", 
  showIcon = true,
  className = ""
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToastContext();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      // Call the logout API
      const response = await authApi.logout();
      
      // Clear local storage and redirect regardless of API response
      logout();
      
      success("Logged out successfully", "See you soon!");
    } catch (err) {
      console.error("Logout error:", err);
      error("Error logging out", "Please try again");
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
    >
      {showIcon && <LogOut className="h-4 w-4 mr-2" />}
      {isLoading ? "Logging out..." : "Log out"}
    </Button>
  );
} 