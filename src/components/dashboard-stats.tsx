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
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formattedTotalValue}</div>
                    <p className="text-xs text-muted-foreground">
                        Total value of all items in stock
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Items in Stock</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalItems}</div>
                    <p className="text-xs text-muted-foreground">
                        Distinct products in inventory
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                    <AlertTriangle className={`h-4 w-4 ${lowStockItems > 0 ? "text-red-500" : "text-muted-foreground"}`} />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${lowStockItems > 0 ? "text-red-500" : ""}`}>
                        {lowStockItems}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Products with quantity less than 10
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
