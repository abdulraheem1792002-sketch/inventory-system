"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InventoryItem } from "@/types/inventory"

interface CategoryDistributionProps {
    data: InventoryItem[]
}

export function CategoryDistribution({ data }: CategoryDistributionProps) {
    // Aggregate data by category
    const categoryCounts: Record<string, number> = {}
    data.forEach(item => {
        const category = item.category || "Uncategorized"
        categoryCounts[category] = (categoryCounts[category] || 0) + 1
    })

    // Format for Recharts
    const chartData = Object.entries(categoryCounts).map(([name, value]) => ({
        name,
        value,
    }))

    const COLORS = [
        "#3b82f6", // blue-500
        "#10b981", // emerald-500
        "#f59e0b", // amber-500
        "#ef4444", // red-500
        "#8b5cf6", // violet-500
        "#ec4899", // pink-500
        "#06b6d4", // cyan-500
    ]

    return (
        <Card className="col-span-7 md:col-span-3">
            <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--card))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '6px'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
