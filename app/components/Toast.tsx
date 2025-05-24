"use client";

import React, { useEffect, useState } from "react";
import { X, Check, AlertCircle, Info, AlertTriangle } from "lucide-react";

export interface ToastProps {
  id: string;
  title: string;
  message?: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
  onClose: (id: string) => void;
}

export default function Toast({ id, title, message, type, duration = 4000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    
    // Auto-close timer
    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoCloseTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50 border-green-200",
          icon: <Check className="w-5 h-5 text-green-600" />,
          iconBg: "bg-green-100",
          text: "text-green-800",
          button: "text-green-600 hover:text-green-800"
        };
      case "error":
        return {
          bg: "bg-red-50 border-red-200",
          icon: <AlertCircle className="w-5 h-5 text-red-600" />,
          iconBg: "bg-red-100",
          text: "text-red-800",
          button: "text-red-600 hover:text-red-800"
        };
      case "warning":
        return {
          bg: "bg-orange-50 border-orange-200",
          icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
          iconBg: "bg-orange-100",
          text: "text-orange-800",
          button: "text-orange-600 hover:text-orange-800"
        };
      case "info":
        return {
          bg: "bg-blue-50 border-blue-200",
          icon: <Info className="w-5 h-5 text-blue-600" />,
          iconBg: "bg-blue-100",
          text: "text-blue-800",
          button: "text-blue-600 hover:text-blue-800"
        };
      default:
        return {
          bg: "bg-gray-50 border-gray-200",
          icon: <Info className="w-5 h-5 text-gray-600" />,
          iconBg: "bg-gray-100",
          text: "text-gray-800",
          button: "text-gray-600 hover:text-gray-800"
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div
      className={`
        max-w-sm w-full ${styles.bg} border rounded-lg shadow-lg p-4 mb-3
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
        }
      `}
    >
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${styles.iconBg} rounded-full p-1.5 mr-3`}>
          {styles.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${styles.text}`}>
            {title}
          </p>
          {message && (
            <p className={`text-sm ${styles.text} opacity-80 mt-1`}>
              {message}
            </p>
          )}
        </div>
        <button
          onClick={handleClose}
          className={`flex-shrink-0 ml-2 ${styles.button} hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors flex items-center justify-center`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
} 