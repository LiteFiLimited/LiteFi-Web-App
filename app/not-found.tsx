"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg border-0 rounded-lg overflow-hidden">
        <div className="p-8 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image 
              src="/logo.png" 
              alt="LiteFi Logo" 
              width={80}
              height={24}
              style={{ width: 'auto', height: 'auto' }}
              priority
            />
          </div>

          {/* 404 Error */}
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
            <p className="text-gray-500 text-sm">
              Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Illustration or Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-red-50 rounded-full flex items-center justify-center">
              <FileQuestion className="w-12 h-12 text-red-500" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/dashboard" className="block">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                Go to Dashboard
              </Button>
            </Link>
            
            <Link href="/" className="block">
              <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Additional Help */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Need help? Contact our{" "}
              <Link href="/support" className="text-red-600 hover:underline">
                support team
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
} 