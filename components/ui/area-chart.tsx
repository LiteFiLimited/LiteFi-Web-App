"use client"

import React from "react";
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_COLORS } from "@/lib/constants";

interface AreaChartProps {
  data: any[];
  xAxisDataKey?: string;
  areaDataKey?: string; 
  height?: number | string;
  className?: string;
  yAxisFormatter?: (value: number) => string;
  tooltipFormatter?: (value: number, name: string) => [string, string];
  colorKey?: keyof typeof CHART_COLORS | string;
}

export function AreaChart({
  data,
  xAxisDataKey = "month",
  areaDataKey = "value",
  height = 300,
  className,
  yAxisFormatter = (value) => {
    if (value === 0) return "$0";
    if (value >= 1000) return `$${Math.round(value / 1000)}k`;
    return `$${value}`;
  },
  tooltipFormatter = (value: number) => {
    return [`$${value.toLocaleString()}`, 'Value'];
  },
  colorKey = "green",
}: AreaChartProps) {
  // Determine the color to use, ensuring it's a string
  const getColorString = (color: any): string => {
    // Check if the color is directly a string
    if (typeof color === 'string') {
      return color;
    }
    
    // Default fallback
    return CHART_COLORS.green as string;
  };
  
  const colorString = getColorString(CHART_COLORS[colorKey as keyof typeof CHART_COLORS] || colorKey);
  
  // Calculate the range for y-axis based on data
  const maxValue = Math.max(...data.map(item => Number(item[areaDataKey]) || 0));
  const minValue = Math.min(...data.map(item => Number(item[areaDataKey]) || 0));

  // Create more tick values for the y-axis (as shown in screenshot)
  const getYAxisTicks = () => {
    const step = maxValue / 8; // Create ~8 tick values for better distribution
    return Array.from({ length: 9 }, (_, i) => Math.round(i * step));
  };

  return (
    <div className={className}>
      {/* Title with grey divider below */}
      <div className="mb-4 pb-2 border-b border-gray-200"></div>
      
      <ResponsiveContainer width="100%" height={height}>
        <RechartsAreaChart
          data={data}
          margin={{
            top: 20,
            right: 0,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id={`colorGradient-${colorKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colorString} stopOpacity={0.5} />
              <stop offset="50%" stopColor={colorString} stopOpacity={0.2} />
              <stop offset="100%" stopColor={colorString} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid as string} />
          <XAxis 
            dataKey={xAxisDataKey} 
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: (CHART_COLORS.gray?.[500] || '#6B7280') }}
          />
          <YAxis 
            tickLine={false} 
            axisLine={false}
            tick={{ fontSize: 12, fill: (CHART_COLORS.gray?.[500] || '#6B7280') }}
            tickFormatter={yAxisFormatter}
            ticks={getYAxisTicks()}
            domain={[0, 'dataMax']}
          />
          <Tooltip
            formatter={tooltipFormatter}
            labelStyle={{ color: (CHART_COLORS.gray?.[900] || '#111827') }}
            contentStyle={{
              backgroundColor: CHART_COLORS.white as string,
              borderRadius: 0,
              border: `1px solid ${CHART_COLORS.tooltip?.border || '#e0e0e0'}`,
              boxShadow: `0 2px 8px ${CHART_COLORS.tooltip?.shadow || 'rgba(0,0,0,0.05)'}`
            }}
          />
          <Area 
            type="monotone" 
            dataKey={areaDataKey} 
            stroke={colorString}
            fill={`url(#colorGradient-${colorKey})` }
            strokeWidth={2}
            activeDot={{ r: 6, fill: colorString, stroke: CHART_COLORS.white as string }}
            animationDuration={1000}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
