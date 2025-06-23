import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  columnCount?: number;
  rowCount?: number;
  showHeader?: boolean;
  className?: string;
}

export function TableSkeleton({
  columnCount = 5,
  rowCount = 3,
  showHeader = true,
  className = "",
}: TableSkeletonProps) {
  return (
    <Card className={`rounded-none shadow-none border-4 border-white overflow-hidden ${className}`}>
      <div className="bg-gray-50 p-6 border-b border-white">
        <Skeleton className="h-7 w-40 mb-2" />
        <Skeleton className="h-5 w-60" />
      </div>
      <div className="bg-white p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            {showHeader && (
              <thead className="bg-gray-50 border-b border-white">
                <tr>
                  {Array.from({ length: columnCount }).map((_, i) => (
                    <th key={i} className="px-6 py-4 text-left">
                      <Skeleton className="h-4 w-24" />
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="bg-white divide-y divide-gray-100">
              {Array.from({ length: rowCount }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array.from({ length: columnCount }).map((_, colIndex) => (
                    <td key={colIndex} className="px-6 py-4">
                      {colIndex === 0 ? (
                        <div className="flex items-center">
                          <Skeleton className="h-8 w-8 rounded-full mr-2" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      ) : colIndex === columnCount - 1 ? (
                        <Skeleton className="h-8 w-24" />
                      ) : (
                        <Skeleton className="h-4 w-20" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
} 