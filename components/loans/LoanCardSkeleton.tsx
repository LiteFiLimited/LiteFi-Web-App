import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoanCardSkeleton() {
  return (
    <Card className="rounded-none shadow-none border-4 border-white overflow-hidden h-full">
      <div className="bg-gray-50 p-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex items-center gap-2 my-4">
          <Skeleton className="h-8 w-32" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="bg-white p-6">
        <div className="flex justify-between items-center lg:flex-col lg:items-start">
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="mt-2">
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </div>
    </Card>
  );
}
