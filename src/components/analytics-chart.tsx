"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format, parseISO } from "date-fns"
import { useMemo } from "react"

interface ClickData {
  created_at: string
}
interface AnalyticsChartProps {
  clickData: ClickData[]
}

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
    <Card className="flex-2 h-fit">
      <CardHeader>
        <CardTitle>All-Time Click Analytics</CardTitle>
        <CardDescription>
          Your all time link performance
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        {formattedData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={formattedData}> {/* Changed from BarChart to AreaChart */}
              <defs> {/* Added defs for gradient */}
                <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" /> 
              {/* Added CartesianGrid */}
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => { // Added tickFormatter for date formatting
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                labelFormatter={(label) => { // Added labelFormatter for date formatting
                  const date = new Date(label);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
                contentStyle={{ color: '#000000', borderRadius: 10 }}
              />
              <Area
                dataKey="total"
                type="natural" // Smooth curves
                fill="url(#fillTotal)" // Use the gradient
                stroke="var(--primary)" // Line color
                stackId="a" // For stacking, even if only one series
                className="fill-primary" // Keep fill-primary class for consistency, though fill prop overrides
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No click data available yet
          </div>
        )}
      </CardContent>
    </Card>
  )
}
