import axios from 'axios';
import { getToken } from './auth';
import { getApiUrl } from './env-config';

// Use the same API URL pattern as other APIs
const API_URL = getApiUrl();

// Create axios instance for notifications (similar to main api.ts)
const notificationAxios = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
notificationAxios.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    console.log('Notification API Request:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      hasToken: !!token,
      tokenLength: token?.length || 0,
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No authentication token found for notification API request!');
    }
    return config;
  },
  (error) => {
    console.error('Notification API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
notificationAxios.interceptors.response.use(
  (response) => {
    console.log('Notification API Response:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('Notification API Response Error:', error);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      console.error('Notification API: Authentication failed');
    }
    
    // Better error messages for network issues
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      console.error('Notification API: Connection timeout');
    } else if (error.code === 'ERR_NETWORK' || !error.response) {
      console.error('Notification API: Network error - cannot connect to backend');
    }
    
    return Promise.reject(error);
  }
);

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  type?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationResponse {
  success: boolean;
  data: Notification[];
  message: string;
}

export interface SingleNotificationResponse {
  success: boolean;
  data: Notification;
  message: string;
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    count: number;
  };
  message: string;
}

export interface CreateNotificationData {
  title: string;
  message: string;
  type?: string;
}

/**
 * Get all user notifications
 */
export const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await notificationAxios.get<NotificationResponse>('/notifications');
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch notifications');
    }
  } catch (error: any) {
    console.error('Failed to fetch notifications:', error);
    
    // Better error handling
    if (error.response) {
      throw new Error(`Failed to fetch notifications: ${error.response.data?.message || error.response.statusText}`);
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Connection timeout while fetching notifications');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error while fetching notifications');
    } else {
      throw new Error(error.message || 'Failed to fetch notifications');
    }
  }
};

/**
 * Get a specific notification by ID
 */
export const fetchNotificationById = async (id: string): Promise<Notification> => {
  try {
    const response = await notificationAxios.get<SingleNotificationResponse>(`/notifications/${id}`);
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch notification');
    }
  } catch (error: any) {
    console.error('Failed to fetch notification:', error);
    
    if (error.response) {
      throw new Error(`Failed to fetch notification: ${error.response.data?.message || error.response.statusText}`);
    } else {
      throw new Error(error.message || 'Failed to fetch notification');
    }
  }
};

/**
 * Get unread notifications count
 */
export const getUnreadCount = async (): Promise<number> => {
  try {
    const response = await notificationAxios.get<UnreadCountResponse>('/notifications/unread-count');
    
    if (response.data.success) {
      return response.data.data.count;
    } else {
      throw new Error(response.data.message || 'Failed to get unread count');
    }
  } catch (error: any) {
    console.error('Failed to get unread count:', error);
    
    if (error.response) {
      throw new Error(`Failed to get unread count: ${error.response.data?.message || error.response.statusText}`);
    } else {
      throw new Error(error.message || 'Failed to get unread count');
    }
  }
};

/**
 * Mark a specific notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
  try {
    const response = await notificationAxios.patch<SingleNotificationResponse>(`/notifications/${notificationId}/read`);
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to mark notification as read');
    }
  } catch (error: any) {
    console.error('Failed to mark notification as read:', error);
    
    if (error.response) {
      throw new Error(`Failed to mark notification as read: ${error.response.data?.message || error.response.statusText}`);
    } else {
      throw new Error(error.message || 'Failed to mark notification as read');
    }
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    const response = await notificationAxios.patch('/notifications/mark-all-read');
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to mark all notifications as read');
    }
  } catch (error: any) {
    console.error('Failed to mark all notifications as read:', error);
    
    if (error.response) {
      throw new Error(`Failed to mark all notifications as read: ${error.response.data?.message || error.response.statusText}`);
    } else {
      throw new Error(error.message || 'Failed to mark all notifications as read');
    }
  }
};

/**
 * Create a new notification (Admin/System use)
 */
export const createNotification = async (notificationData: CreateNotificationData): Promise<Notification> => {
  try {
    const response = await notificationAxios.post<SingleNotificationResponse>('/notifications', {
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type || 'INFO'
    });
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to create notification');
    }
  } catch (error: any) {
    console.error('Failed to create notification:', error);
    
    if (error.response) {
      throw new Error(`Failed to create notification: ${error.response.data?.message || error.response.statusText}`);
    } else {
      throw new Error(error.message || 'Failed to create notification');
    }
  }
};

/**
 * Format notification time for display
 */
export const formatNotificationTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

/**
 * Notification API object with all methods
 */
export const notificationApi = {
  fetchNotifications,
  fetchNotificationById,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  createNotification,
  formatNotificationTime
};

export default notificationApi; 