"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, ImageIcon } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { InventoryActions } from "./inventory-actions"
import { InventoryItem } from "@/types/inventory"

export const columns: ColumnDef<InventoryItem>[] = [
    {
        accessorKey: "image_url",
        header: "Image",
        cell: ({ row }) => {
            const imageUrl = row.getValue("image_url") as string
            if (!imageUrl) return <div className="h-10 w-10 flex items-center justify-center bg-muted rounded-md"><ImageIcon className="h-4 w-4 text-muted-foreground" /></div>
            return (
                <div className="relative h-10 w-10 rounded-md overflow-hidden">
                    <Image src={imageUrl} alt="Product" fill className="object-cover" />
                </div>
            )
        },
        enableSorting: false,
    },
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
