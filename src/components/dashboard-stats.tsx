"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InventoryItem } from "@/types/inventory"
import { DollarSign, Package, AlertTriangle } from "lucide-react"

interface DashboardStatsProps {
    items: InventoryItem[]
}

export function DashboardStats({ items }: DashboardStatsProps) {
    const totalItems = items.length
    const lowStockItems = items.filter((item) => item.quantity < 10).length
    const totalValue = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    )

    const formattedTotalValue = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(totalValue)

    return (
        <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card className="relative overflow-hidden shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formattedTotalValue}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        +20.1% from last month
                    </p>
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalItems}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Across 4 categories
                    </p>
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                    <AlertTriangle className={`h-4 w-4 ${lowStockItems > 0 ? "text-destructive" : "text-muted-foreground"}`} />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{lowStockItems}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {lowStockItems > 0 ? (
                            <span className="text-destructive font-medium">{lowStockItems} items need attention</span>
                        ) : (
                            "Inventory levels are healthy"
                        )}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
    )
}
