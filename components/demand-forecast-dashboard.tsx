"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ForecastForm } from "@/components/forecast-form"
import { ForecastResults } from "@/components/forecast-results"
import { ThemeToggle } from "@/components/theme-toggle"

// Define the form schema with Zod
export const forecastFormSchema = z.object({
  date: z.date(),
  storeId: z.string(),
  productId: z.string(),
  category: z.string(),
  region: z.string(),
  inventoryLevel: z.number().min(0),
  unitsSold: z.number().min(0),
  unitsOrdered: z.number().min(0),
  price: z.number().min(0),
  discount: z.number().min(0).max(100),
  weatherCondition: z.string(),
  isHoliday: z.boolean(),
  competitorPricing: z.number().min(0),
  seasonality: z.string(),
})

export type ForecastFormValues = z.infer<typeof forecastFormSchema>

export function DemandForecastDashboard() {
  const [forecastData, setForecastData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ForecastFormValues>({
    resolver: zodResolver(forecastFormSchema),
    defaultValues: {
      date: new Date(),
      storeId: "",
      productId: "",
      category: "",
      region: "",
      inventoryLevel: 0,
      unitsSold: 0,
      unitsOrdered: 0,
      price: 0,
      discount: 0,
      weatherCondition: "",
      isHoliday: false,
      competitorPricing: 0,
      seasonality: "",
    },
  })

  async function onSubmit(data: ForecastFormValues) {
    setIsLoading(true)

    // Simulate API call with a timeout
    setTimeout(() => {
      // Mock forecast data
      const mockForecast = {
        predictedDemand: Math.floor(Math.random() * 1000) + 100,
        confidence: Math.floor(Math.random() * 30) + 70,
        historicalData: Array.from({ length: 12 }, (_, i) => ({
          month: i + 1,
          demand: Math.floor(Math.random() * 1000) + 100,
        })),
        forecastData: Array.from({ length: 6 }, (_, i) => ({
          month: i + 13,
          demand: Math.floor(Math.random() * 1000) + 100,
        })),
      }

      setForecastData(mockForecast)
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Stock Demand Forecast</h1>
        <ThemeToggle />
      </div>

      <Tabs defaultValue="input" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="input">Input Parameters</TabsTrigger>
          <TabsTrigger value="results" disabled={!forecastData}>
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card>
              <CardHeader>
                <CardTitle>Forecast Parameters</CardTitle>
                <CardDescription>Enter the stock parameters to predict demand forecast</CardDescription>
              </CardHeader>
              <CardContent>
                <ForecastForm form={form} onSubmit={onSubmit} isLoading={isLoading} />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="results">
          {forecastData && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <ForecastResults data={forecastData} />
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

