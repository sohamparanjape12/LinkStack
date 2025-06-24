"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format, parseISO } from "date-fns"
import { useMemo } from "react"
import { InteractiveAreaChart } from "./area-chart"

interface ClickData {
  created_at: string
}
interface AnalyticsChartProps {
  clickData: ClickData[]
}

const aggregateLCChartData = (visitorData: any[], label = "Clicks") => {
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

export function AnalyticsChart({ clickData }: AnalyticsChartProps) {
  const formattedData = useMemo(() => {
    if (!clickData || clickData.length === 0) {
      return [];
    }

    const groupedData = clickData.reduce((acc, click) => {
      const date = format(parseISO(click.created_at), 'MMM dd, yyyy');
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(groupedData).map(([date, count]) => ({
      name: date,
      total: count,
    })).sort((a, b) => new Date(b.name).getTime() - new Date(a.name).getTime());
  }, [clickData]);

  return (
    <InteractiveAreaChart
      chartData={aggregateLCChartData(clickData)}
      title="Click Analytics"
      description="Click Data Over Time"
      keys={[
        { key: "Clicks", label: "Clicks", color: "#64748b" },
      ]}
      key={"CLicks"}
    />
  )
}
