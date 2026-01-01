"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartData {
    name: string
    total: number
}

export function StockTrendChart({ data }: { data: ChartData[] }) {
    // Determine if data is empty to show a placeholder or empty state
    const isEmpty = data.every(item => item.total === 0)

    return (
        <Card className="col-span-4 bg-[#0a0a1f]/60 backdrop-blur-sm border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.05)]">
            <CardHeader>
                <CardTitle className="text-cyan-100 tracking-wide font-semibold">Inventory Movement (Transfers)</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#4b5563"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#a5f3fc' }}
                        />
                        <YAxis
                            stroke="#4b5563"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                            tick={{ fill: '#a5f3fc' }}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(34, 211, 238, 0.1)' }}
                            contentStyle={{
                                backgroundColor: '#0f172a',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(34, 211, 238, 0.3)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                color: '#fff'
                            }}
                            itemStyle={{ color: '#22d3ee' }}
                        />
                        <Bar
                            dataKey="total"
                            fill="url(#colorTotal)"
                            radius={[4, 4, 0, 0]}
                        >
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0.8} />
                                </linearGradient>
                            </defs>
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                {isEmpty && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <p className="text-cyan-100/20 text-lg font-medium">No movement data</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
