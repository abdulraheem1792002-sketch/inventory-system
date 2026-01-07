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
            <Card className="relative overflow-hidden border-none bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-blue-100">Total Value</CardTitle>
                    <DollarSign className="h-6 w-6 text-blue-200 opacity-75" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{formattedTotalValue}</div>
                    <p className="text-xs text-blue-100 mt-1 opacity-80">
                        +20.1% from last month
                    </p>
                    <div className="absolute right-[-20px] bottom-[-20px] rotate-[-15deg] opacity-10">
                        <DollarSign className="h-32 w-32" />
                    </div>
                </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-none bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-100">Total Items</CardTitle>
                    <Package className="h-6 w-6 text-purple-200 opacity-75" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{totalItems}</div>
                    <p className="text-xs text-purple-100 mt-1 opacity-80">
                        Unique products available
                    </p>
                    <div className="absolute right-[-20px] bottom-[-20px] rotate-[-15deg] opacity-10">
                        <Package className="h-32 w-32" />
                    </div>
                </CardContent>
            </Card>

            <Card className={`relative overflow-hidden border-none shadow-xl ${lowStockItems > 0 ? "bg-gradient-to-br from-orange-500 to-red-600" : "bg-gradient-to-br from-emerald-500 to-emerald-600"} text-white`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white/90">Low Stock Alerts</CardTitle>
                    <AlertTriangle className="h-6 w-6 text-white/80" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold">{lowStockItems}</div>
                    <p className="text-xs text-white/90 mt-1 opacity-80">
                        {lowStockItems > 0 ? "Items require attention" : "Everything looks good"}
                    </p>
                    <div className="absolute right-[-20px] bottom-[-20px] rotate-[-15deg] opacity-10">
                        <AlertTriangle className="h-32 w-32" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )

}
