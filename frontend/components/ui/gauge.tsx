"use client"

import { cn } from "@/lib/utils"

interface GaugeProps {
  value: number
  size?: "small" | "medium" | "large"
  showValue?: boolean
  className?: string
}

export function Gauge({ value, size = "medium", showValue = false, className }: GaugeProps) {
  const percentage = Math.min(Math.max(value, 0), 100)

  // Calculate the stroke dash offset based on the percentage
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  // Determine color based on percentage
  const getColor = () => {
    if (percentage < 30) return "text-red-500"
    if (percentage < 70) return "text-yellow-500"
    return "text-green-500"
  }

  // Determine size
  const getSize = () => {
    switch (size) {
      case "small":
        return "h-24 w-24"
      case "large":
        return "h-48 w-48"
      default:
        return "h-36 w-36"
    }
  }

  return (
    <div className={cn("relative flex items-center justify-center", getSize(), className)}>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="text-muted-foreground/20"
          cx="50"
          cy="50"
          r={radius}
          strokeWidth="8"
          fill="none"
          stroke="currentColor"
        />
        {/* Foreground circle */}
        <circle
          className={cn("transition-all duration-300 ease-in-out", getColor())}
          cx="50"
          cy="50"
          r={radius}
          strokeWidth="8"
          fill="none"
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-bold", getColor())}>{percentage}%</span>
        </div>
      )}
    </div>
  )
}

