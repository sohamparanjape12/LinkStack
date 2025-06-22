'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Computer, Globe } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { cn } from "@/lib/utils"
import { addDays, format } from "date-fns"

interface VisitorData {
  id: string
  user_id: string
  page_path: string
  referrer: string
  browser: string
  os: string
  device: string
  created_at: string
}

interface Props {
  visitorData: VisitorData[]
}

export function VisitorAnalytics({ visitorData }: Props) {
  const [chartData, setChartData] = useState<any[]>([])
  const [deviceData, setDeviceData] = useState<any[]>([])
  const [browserData, setBrowserData] = useState<any[]>([])

  useEffect(() => {
    // Process data for last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(new Date(), -i)
      const dayVisits = visitorData.filter(visit => 
        new Date(visit.created_at).toDateString() === date.toDateString()
      ).length

      return {
        name: format(date, 'EEE'),
        total: dayVisits
      }
    }).reverse()

    const devices = visitorData.reduce((acc, curr) => {
      acc[curr.device] = (acc[curr.device] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const browsers = visitorData.reduce((acc, curr) => {
      acc[curr.browser] = (acc[curr.browser] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    setChartData(last7Days)
    setDeviceData(Object.entries(devices).map(([name, value]) => ({ name, value })))
    setBrowserData(Object.entries(browsers).map(([name, value]) => ({ name, value })))
  }, [visitorData])

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-1 grid-cols-1 gap-4">
      <Card className="">
        <CardHeader>
          <CardTitle>Visitor Traffic</CardTitle>
          <CardDescription>Your visitor activity over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          {chartData.some(day => day.total > 0) ? (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{ color: '#000000', borderRadius: 10 }}
                />
                <Area
                  dataKey="total"
                  type="natural"
                  fill="url(#fillTotal)"
                  radius={4}
                  className="fill-primary"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[350px] text-muted-foreground">
              No visitor data available yet
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Computer className="h-4 w-4" />
            Devices
          </CardTitle>
          <CardDescription>Visitor device breakdown</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          {deviceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={deviceData}>
                <defs>
                  <linearGradient id="fillDevice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />=
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{ color: '#000000', borderRadius: 10 }}
                />
                <Area
                  dataKey="value"
                  type="natural"
                  fill="url(#fillTotal)"
                  radius={4}
                  className="fill-primary"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[350px] text-muted-foreground">
              No device data yet
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Browsers
          </CardTitle>
          <CardDescription>Visitor browser breakdown</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          {browserData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={deviceData}>
                <defs>
                  <linearGradient id="fillDevice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                  contentStyle={{ color: '#000000', borderRadius: 10 }}
                />
                <Area
                  dataKey="value"
                  type="natural"
                  fill="url(#fillTotal)"
                  radius={4}
                  className="fill-primary"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[350px] text-muted-foreground">
              No browser data yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
