"use client"

import { useTheme } from "next-themes"
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ChartData {
  month: number
  demand: number
  type: string
}

interface ForecastChartProps {
  data: ChartData[]
}

export function ForecastChart({ data }: ForecastChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Format month numbers to month names
  const formatMonth = (month: number) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // Handle months beyond 12 (for forecast data)
    const adjustedMonth = (month - 1) % 12
    return monthNames[adjustedMonth]
  }

  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="historicalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="month"
            tickFormatter={formatMonth}
            stroke={isDark ? "#6b7280" : "#9ca3af"}
            tick={{ fill: isDark ? "#d1d5db" : "#4b5563" }}
          />
          <YAxis stroke={isDark ? "#6b7280" : "#9ca3af"} tick={{ fill: isDark ? "#d1d5db" : "#4b5563" }} />
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="demand"
            name="Historical"
            stroke="#0ea5e9"
            fillOpacity={1}
            fill="url(#historicalGradient)"
            activeDot={{ r: 8 }}
            hide={data.filter((d) => d.type === "Forecast").length > 0}
          />
          <Area
            type="monotone"
            dataKey="demand"
            name="Forecast"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#forecastGradient)"
            activeDot={{ r: 8 }}
            hide={data.filter((d) => d.type === "Historical").length > 0}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const monthName = (() => {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ]
      const adjustedMonth = (data.month - 1) % 12
      return monthNames[adjustedMonth]
    })()

    const year = Math.floor((data.month - 1) / 12) + 2023

    return (
      <ChartTooltip>
        <ChartTooltipContent>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">{`${monthName} ${year}`}</p>
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: data.type === "Historical" ? "#0ea5e9" : "#10b981",
                }}
              />
              <p className="text-sm">
                <span className="font-medium">{data.type}: </span>
                {data.demand} units
              </p>
            </div>
          </div>
        </ChartTooltipContent>
      </ChartTooltip>
    )
  }

  return null
}

