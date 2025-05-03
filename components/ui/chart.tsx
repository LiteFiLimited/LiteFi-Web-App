"use client"

import * as React from "react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts"
import { CHART_COLORS } from "@/lib/constants"

interface ChartProps {
  data: any[]
  xAxisDataKey?: string
  bars: {
    dataKey: string
    color: string
    name: string
  }[]
  height?: number | string
  className?: string
  yAxisFormatter?: (value: number) => string
  hideLegend?: boolean
}

export function Chart({
  data,
  xAxisDataKey = "name",
  bars,
  height = 300,
  className,
  yAxisFormatter = (value) => `${value}`,
  hideLegend = false,
  ...props
}: ChartProps) {
  // Function to resolve color references
  const resolveColor = (colorRef: string): string => {
    // If it's a direct reference to our predefined colors (e.g., "purple", "orange")
    if (typeof CHART_COLORS[colorRef as keyof typeof CHART_COLORS] === 'string') {
      return CHART_COLORS[colorRef as keyof typeof CHART_COLORS] as string;
    }
    
    // If it's already a hex value (#FF9500) or any other CSS color format
    if (colorRef.startsWith('#') || colorRef.startsWith('rgb') || colorRef.startsWith('hsl')) {
      return colorRef;
    }

    // Handle hsl(var(--chart-*)) format - extract the chart color name
    if (colorRef.includes('var(--chart-')) {
      const colorName = colorRef.match(/var\(--chart-(.*?)\)/)?.[1];
      if (colorName && typeof CHART_COLORS[colorName as keyof typeof CHART_COLORS] === 'string') {
        return CHART_COLORS[colorName as keyof typeof CHART_COLORS] as string;
      }
    }
    
    // Default fallback
    return colorRef;
  };

  // Get maximum value from the data to set appropriate Y axis ticks
  const maxValue = React.useMemo(() => {
    let max = 0;
    data.forEach(item => {
      bars.forEach(bar => {
        const val = Number(item[bar.dataKey]) || 0;
        if (val > max) max = val;
      });
    });
    return max;
  }, [data, bars]);

  // Generate appropriate tick values
  const tickValues = React.useMemo(() => {
    const step = Math.ceil(maxValue / 4);
    return [0, step, step * 2, step * 3, maxValue];
  }, [maxValue]);

  return (
    <div className={className} {...props}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{
            top: 15,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={CHART_COLORS.grid} />
          <XAxis 
            dataKey={xAxisDataKey} 
            tickLine={false} 
            axisLine={false} 
            fontSize={12} 
          />
          <YAxis 
            tickLine={false} 
            axisLine={false} 
            fontSize={12} 
            tickFormatter={(value) => {
              if (value === 0) return "0";
              if (value >= 1000000) return `${Math.round(value / 1000000)}M`;
              return `${Math.round(value / 1000)}k`;
            }}
            ticks={tickValues}
            width={30}
            domain={[0, 'dataMax']}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: CHART_COLORS.white,
              borderRadius: 0,
              border: `1px solid ${CHART_COLORS.tooltip.border}`,
              boxShadow: `0 2px 8px ${CHART_COLORS.tooltip.shadow}`
            }}
            formatter={(value: number, name: string) => {
              // Format the value with commas for better readability in tooltip
              const formattedValue = value.toLocaleString();
              return [`₦${formattedValue}`, name];
            }}
          />
          {!hideLegend && (
            <Legend 
              wrapperStyle={{
                paddingTop: 10
              }}
            />
          )}
          {bars.map((bar, index) => (
            <Bar
              key={index}
              dataKey={bar.dataKey}
              fill={resolveColor(bar.color)}
              name={bar.name}
              radius={[4, 4, 0, 0]}
              barSize={32}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}