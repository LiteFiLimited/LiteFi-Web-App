"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import ToastContainer from "./ToastContainer";
import { ToastProps } from "./Toast";

interface ToastContextType {
  success: (title: string, message?: string, duration?: number) => void;
  error: (title: string, message?: string, duration?: number) => void;
  warning: (title: string, message?: string, duration?: number) => void;
  info: (title: string, message?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Date.now().toString();
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: () => {}, // Will be set by ToastContainer
    };
    
    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ title, message, type: 'success', duration });
  }, [addToast]);

  const error = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ title, message, type: 'error', duration });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ title, message, type: 'warning', duration });
  }, [addToast]);

  const info = useCallback((title: string, message?: string, duration?: number) => {
    addToast({ title, message, type: 'info', duration });
  }, [addToast]);

  const contextValue: ToastContextType = {
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </ToastContext.Provider>
  );
} 