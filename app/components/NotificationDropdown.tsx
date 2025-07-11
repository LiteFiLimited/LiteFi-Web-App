"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check, X, CreditCard, TrendingUp, AlertCircle, DollarSign } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { formatNotificationTime } from "@/lib/notificationApi";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
  onNotificationChange?: (unreadCount: number) => void;
  onShowToast?: {
    success: (title: string, message?: string, duration?: number) => void;
    info: (title: string, message?: string, duration?: number) => void;
    error: (title: string, message?: string, duration?: number) => void;
  };
}

// Client-side only component
const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ 
  isOpen, 
  onClose, 
  triggerRef, 
  onNotificationChange, 
  onShowToast 
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { 
    notifications, 
    unreadCount, 
    loading, 
    error, 
    markAsRead, 
    markAllAsRead: markAllNotificationsAsRead,
    refreshNotifications 
  } = useNotifications();

  // Notify parent component of unread count changes
  useEffect(() => {
    onNotificationChange?.(unreadCount);
  }, [unreadCount, onNotificationChange]);

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

  // Handle marking single notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
    onShowToast?.success("Notification marked as read");
    } catch (error) {
      onShowToast?.error("Failed to mark notification as read");
    }
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
    onShowToast?.success("All notifications marked as read");
    } catch (error) {
      onShowToast?.error("Failed to mark all notifications as read");
    }
  };

  // Get icon based on notification type or content
  const getNotificationIcon = (notification: any) => {
    const { title, message, type } = notification;
    
    // Check title/message content for specific icons
    if (title.toLowerCase().includes('loan') || title.toLowerCase().includes('payment')) {
      return <CreditCard className="w-4 h-4" />;
    }
    if (title.toLowerCase().includes('investment') || title.toLowerCase().includes('earnings')) {
      return <TrendingUp className="w-4 h-4" />;
    }
    if (title.toLowerCase().includes('wallet') || title.toLowerCase().includes('fund')) {
      return <DollarSign className="w-4 h-4" />;
    }
    
    // Fallback to type-based icons
    switch (type?.toLowerCase()) {
      case 'success':
        return <TrendingUp className="w-4 h-4" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4" />;
      case 'error':
        return <X className="w-4 h-4" />;
      case 'info':
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeStyles = (type?: string) => {
    switch (type?.toLowerCase()) {
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
            <div className="flex items-center gap-2">
            {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  disabled={loading}
                >
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshNotifications}
                className="text-xs text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">
              <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300 animate-pulse" />
              <p className="text-sm">Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-300" />
              <p className="text-sm">Failed to load notifications</p>
              <p className="text-xs text-red-400 mt-1">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshNotifications}
                className="mt-2 text-xs"
              >
                Try again
              </Button>
            </div>
          ) : notifications.length === 0 ? (
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
                    {getNotificationIcon(notification)}
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
                          {formatNotificationTime(notification.timestamp)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                            title="Mark as read"
                            disabled={loading}
                          >
                            <Check className="w-3 h-3 text-gray-500" />
                          </button>
                        )}
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
};

export default NotificationDropdown; 