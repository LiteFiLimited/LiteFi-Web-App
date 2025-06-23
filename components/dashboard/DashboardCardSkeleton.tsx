import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardCardSkeleton() {
  return (
    <Card className="rounded-none shadow-none border-4 border-white overflow-hidden h-full">
      <div className="bg-gray-50 p-6 border-b border-white">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex items-center gap-2 my-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="bg-white p-6">
        <div className="flex justify-between items-center lg:flex-col lg:items-start">
          <div>
            <Skeleton className="h-4 w-40 mb-1" />
            <div className="grid grid-cols-1 gap-2 mt-2">
              <div className="flex items-center">
                <Skeleton className="h-4 w-24 mr-2" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center">
                <Skeleton className="h-4 w-16 mr-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center">
                <Skeleton className="h-4 w-12 mr-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
} 