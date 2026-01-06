"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { InventoryActions } from "./inventory-actions"
import { InventoryItem } from "@/types/inventory"

export const columns: ColumnDef<InventoryItem>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount)

            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            const description = row.getValue("description") as string
            if (!description) return <span className="text-muted-foreground">-</span>
            return (
                <div className="max-w-[200px] truncate" title={description}>
                    {description}
                </div>
            )
        },
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) => {
            const date = new Date(row.getValue("created_at"))
            return <div>{date.toLocaleDateString("en-US")}</div>
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const item = row.original
            return <InventoryActions item={item} />
        },
    },
]
