import React from "react";
import { DashboardCardSkeleton } from "@/components/dashboard/DashboardCardSkeleton";
import { TableSkeleton } from "@/components/dashboard/TableSkeleton";

export default function DashboardLoading() {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-64 bg-primary/10 animate-pulse rounded-md"></div>
      </div>
      
      <div className="h-6 w-48 bg-primary/10 animate-pulse rounded-md mb-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
        <DashboardCardSkeleton />
      </div>

      <TableSkeleton className="mt-6" columnCount={6} rowCount={3} />
      <TableSkeleton className="mt-6" columnCount={5} rowCount={3} />
    </>
  );
} 