"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ForecastChart } from "@/components/forecast-chart"
import { Badge } from "@/components/ui/badge"
import { Gauge } from "@/components/ui/gauge"

interface ForecastResultsProps {
  data: {
    predictedDemand: number
    confidence: number
    historicalData: Array<{ month: number; demand: number }>
    forecastData: Array<{ month: number; demand: number }>
  }
}

export function ForecastResults({ data }: ForecastResultsProps) {
  const { predictedDemand, confidence, historicalData, forecastData } = data

  // Combine historical and forecast data for the chart
  const chartData = [
    ...historicalData.map((item) => ({
      ...item,
      type: "Historical",
    })),
    ...forecastData.map((item) => ({
      ...item,
      type: "Forecast",
    })),
  ]

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Predicted Demand</CardTitle>
              <CardDescription>Forecasted demand based on your inputs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-4xl font-bold">{predictedDemand}</div>
                <Badge variant="outline" className="text-sm">
                  Units
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Confidence Level</CardTitle>
              <CardDescription>Accuracy of the prediction model</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Gauge value={confidence} size="medium" showValue />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Demand Forecast Trend</CardTitle>
            <CardDescription>Historical data and future predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ForecastChart data={chartData} />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

