"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { InventoryItem } from "@/types/inventory"
import Papa from "papaparse"
import { toast } from "sonner"

interface ExportButtonProps {
    data: InventoryItem[]
}

export function ExportButton({ data }: ExportButtonProps) {
    const handleExport = () => {
        try {
            if (!data || data.length === 0) {
                toast.error("No data to export")
                return
            }

            // Prepare data for export (exclude internal fields if unwanted)
            const exportData = data.map(item => ({
                Name: item.name,
                Category: item.category || "",
                Price: item.price,
                Quantity: item.quantity,
                Description: item.description || "",
                "Created At": new Date(item.created_at || "").toLocaleDateString(),
                "Image URL": item.image_url || ""
            }))

            // Convert to CSV
            const csv = Papa.unparse(exportData)

            // Create blob and download link
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `inventory_export_${new Date().toISOString().split('T')[0]}.csv`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            toast.success("Inventory exported successfully")
        } catch (error) {
            console.error("Export failed:", error)
            toast.error("Failed to export inventory")
        }
    }

    return (
        <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
    )
}
