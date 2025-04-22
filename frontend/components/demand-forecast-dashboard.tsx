"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ForecastForm } from "@/components/forecast-form"
import { ForecastResults } from "@/components/forecast-results"
import { ThemeToggle } from "@/components/theme-toggle"
import axios from "axios"

// Define Zod schema
export const forecastFormSchema = z.object({
  date: z.date(),
  category: z.number().min(0).max(100),
  region: z.number().min(0).max(100),
  inventoryLevel: z.number().min(0),
  unitsSold: z.number().min(0),
  price: z.number().min(0),
  discount: z.number().min(0).max(100),
  weatherCondition: z.number().min(0).max(100),
  isHoliday: z.boolean(),
  seasonality: z.number().min(0).max(100),
})

export type ForecastFormValues = z.infer<typeof forecastFormSchema>

export function DemandForecastDashboard() {
  const [forecastData, setForecastData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ForecastFormValues>({
    resolver: zodResolver(forecastFormSchema),
    defaultValues: {
      date: new Date(),
      category: 0,
      region: 0,
      inventoryLevel: 0,
      unitsSold: 0,
      price: 0,
      discount: 0,
      weatherCondition: 0,
      isHoliday: false,
      seasonality: 0,
    },
  })

  const onSubmit = async (data: ForecastFormValues) => {
    setIsLoading(true)
    try {
      const response = await axios.post("http://127.0.0.1:8000/predict", {
        product_category: data.category,
        shelf_location: data.region,
        // date: data.date.toISOString().split("T")[0],
        stock_level: data.inventoryLevel,
        units_sold: data.unitsSold,
        price: data.price,
        discount: data.discount,
        weather: data.weatherCondition,
        is_holiday: data.isHoliday,
        seasonality: data.seasonality,
      })

      setForecastData(response.data)
    } catch (error) {
      console.error("Prediction error:", error)
    } finally {
      setIsLoading(false)
    }
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
          <TabsTrigger value="results" disabled={!forecastData}>Results</TabsTrigger>
        </TabsList>

        <TabsContent value="input">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ForecastResults data={forecastData} />
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
