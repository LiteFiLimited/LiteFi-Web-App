"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check, X, CreditCard, TrendingUp, AlertCircle, DollarSign } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "info" | "error";
  timestamp: string;
  isRead: boolean;
  icon: React.ReactNode;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  onNotificationChange?: (notifications: Notification[]) => void;
  onShowToast?: {
    success: (title: string, message?: string, duration?: number) => void;
    info: (title: string, message?: string, duration?: number) => void;
  };
}

export default function NotificationDropdown({ isOpen, onClose, triggerRef, onNotificationChange, onShowToast }: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Loan Payment Due",
      message: "Your salary loan payment of ₦40,000 is due in 3 days",
      type: "warning",
      timestamp: "2 hours ago",
      isRead: false,
      icon: <CreditCard className="w-4 h-4" />
    },
    {
      id: "2",
      title: "Investment Matured",
      message: "Your Naira investment has matured. Earnings: ₦14,000",
      type: "success",
      timestamp: "5 hours ago",
      isRead: false,
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: "3",
      title: "Wallet Funded",
      message: "Your wallet has been credited with ₦50,000",
      type: "success",
      timestamp: "1 day ago",
      isRead: true,
      icon: <DollarSign className="w-4 h-4" />
    },
    {
      id: "4",
      title: "Profile Verification",
      message: "Please complete your profile verification to access all features",
      type: "info",
      timestamp: "2 days ago",
      isRead: true,
      icon: <AlertCircle className="w-4 h-4" />
    }
  ]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      );
      // Use setTimeout to defer the parent state update
      setTimeout(() => {
        onNotificationChange?.(updated);
      }, 0);
      return updated;
    });
    onShowToast?.success("Notification marked as read");
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(notification => ({ ...notification, isRead: true }));
      // Use setTimeout to defer the parent state update
      setTimeout(() => {
        onNotificationChange?.(updated);
      }, 0);
      return updated;
    });
    onShowToast?.success("All notifications marked as read");
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(notification => notification.id !== id);
      // Use setTimeout to defer the parent state update
      setTimeout(() => {
        onNotificationChange?.(updated);
      }, 0);
      return updated;
    });
    onShowToast?.info("Notification removed");
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-600 bg-green-50";
      case "warning":
        return "text-orange-600 bg-orange-50";
      case "error":
        return "text-red-600 bg-red-50";
      case "info":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 z-50">
      <Card 
        ref={dropdownRef}
        className="w-80 max-h-96 overflow-hidden shadow-lg border-0 rounded-lg"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full font-medium min-w-[16px] h-4 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  !notification.isRead ? "bg-blue-50/30" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${getTypeStyles(notification.type)}`}>
                    {notification.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-xs text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400">
                          {notification.timestamp}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-3 h-3 text-gray-500" />
                          </button>
                        )}
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                          title="Remove notification"
                        >
                          <X className="w-3 h-3 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-sm text-gray-600 hover:text-gray-800"
            >
              View all notifications
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
} 