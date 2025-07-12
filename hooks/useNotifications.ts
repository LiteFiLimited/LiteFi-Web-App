import { useState, useEffect, useCallback } from "react";
import {
  fetchNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  type Notification as ApiNotification,
} from "../lib/notificationApi";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type?: string;
  timestamp: string;
  isRead: boolean;
  icon?: React.ReactNode;
}

// Transform API notification to our local interface
const transformApiNotification = (
  apiNotification: ApiNotification
): Notification => ({
  id: apiNotification.id,
  title: apiNotification.title,
  message: apiNotification.message,
  type: "info", // Default type since API doesn't include type
  timestamp: apiNotification.createdAt,
  isRead: apiNotification.read,
});

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications from backend
  const fetchNotificationsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const apiNotifications = await fetchNotifications();
      const transformedNotifications = apiNotifications.map(
        transformApiNotification
      );

      setNotifications(transformedNotifications);

      // Update unread count from API
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch notifications"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      await markNotificationAsRead(id);

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );

      // Update unread count
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to mark notification as read"
      );
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await markAllNotificationsAsRead();

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true }))
      );

      // Reset unread count
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to mark all notifications as read"
      );
    }
  }, []);

  // Legacy methods for backward compatibility (local state only)
  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp" | "isRead">) => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => {
      const notification = prev.find((n) => n.id === id);
      const newNotifications = prev.filter(
        (notification) => notification.id !== id
      );

      // Update unread count if removing an unread notification
      if (notification && !notification.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      return newNotifications;
    });
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Refresh notifications (useful for manual refresh)
  const refreshNotifications = useCallback(() => {
    fetchNotificationsData();
  }, [fetchNotificationsData]);

  // Initial load
  useEffect(() => {
    fetchNotificationsData();
  }, [fetchNotificationsData]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    // Backend API methods
    fetchNotifications: fetchNotificationsData,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
    // Legacy local methods for backward compatibility
    addNotification,
    removeNotification,
    clearAllNotifications,
  };
};
