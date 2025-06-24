'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { Computer, Globe } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { cn } from "@/lib/utils"
import { addDays, format } from "date-fns"
import { InteractiveAreaChart } from "./area-chart"

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
  const [visitorChartData, setVisitorChartData] = useState<any[]>([]);
  const [deviceData, setDeviceChartData] = useState<any[]>([]);
  const [browserData, setBrowserChartData] = useState<any[]>([]);
  const [osData, setOsChartData] = useState<any[]>([]);

  const aggregateChartData = (visitorData: VisitorData[], key: string) => {
    const byDate: Record<string, Record<string, number>> = {}
    const allGroups = new Set<string>()

    // Collect all possible groups and aggregate by date
    visitorData.forEach((item) => {
      const date = format(new Date(item.created_at), 'yyyy-MM-dd')
      const group = key === "visitors" ? "Visitors" : item[key as keyof VisitorData]
      
      allGroups.add(group)
      
      if (!byDate[date]) byDate[date] = {}
      byDate[date][group] = (byDate[date][group] || 0) + 1
    })

    // Fill missing values with 0
    return Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, groupCounts]) => {
        const result: any = { date }
        allGroups.forEach(group => {
          result[group] = groupCounts[group] || 0
        })
        return result
      })
  }

  const aggregateVChartData = (visitorData: any[], label = "Visitors") => {
    const byDate: Record<string, number> = {};

    visitorData.forEach((item) => {
      const date = format(new Date(item.created_at), 'yyyy-MM-dd');
      byDate[date] = (byDate[date] || 0) + 1;
    });

    return Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({
        date,
        [label]: count,
      }));
  };


  const visitorKeys = [
    { key: "Visitors", label: "Visitors", color: "#64748b" }
  ]

  const deviceKeys = [
    { key: "Desktop", label: "Desktop", color: "#64748b" },
    { key: "Mobile", label: "Mobile", color: "#334155" },
    { key: "Tablet", label: "Tablet", color: "#0f172a" },
  ]

  const browserKeys = [
    { key: "Safari", label: "Safari", color: "#cbd5e1" },
    { key: "Chrome", label: "Chrome", color: "#64748b" },
    { key: "Firefox", label: "Firefox", color: "#334155" },
    { key: "Edge", label: "Edge", color: "#0f172a" },
  ]

  const osKeys = [
    { key: "Windows", label: "Windows", color: "#64748b" },
    { key: "MacOS", label: "MacOS", color: "#334155" },
    { key: "Linux", label: "Linux", color: "#0f172a" },
  ]

  useEffect(() => {
    const vData = aggregateVChartData(visitorData, "Visitors")
    const deviceData = aggregateChartData(visitorData, "device")
    const browserData = aggregateChartData(visitorData, "browser")
    const osData = aggregateChartData(visitorData, "os")

    setVisitorChartData(vData);
    setDeviceChartData(deviceData);
    setBrowserChartData(browserData);
    setOsChartData(osData);

  }, [visitorData]);


  return (
    <div className="grid col-span-full lg:grid-cols-2 md:grid-cols-1 grid-cols-1 gap-4">
      <InteractiveAreaChart
        title="Visitor Data Over Time"
        description="Visitor distribution by date"
        chartData={visitorChartData}
        keys={visitorKeys}
      />
      <InteractiveAreaChart
        title="Device Data Over Time"
        description="Device distribution by date"
        chartData={deviceData}
        keys={deviceKeys}
      />
      <InteractiveAreaChart
        title="Browser Data Over Time"
        description="Browser distribution by date"
        chartData={browserData}
        keys={browserKeys}
      />
      <InteractiveAreaChart
        title="OS Data Over Time"
        description="OS distribution by date"
        chartData={osData}
        keys={osKeys}
      />
    </div>
  )
}
