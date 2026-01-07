"use client"

import { useState } from "react"
import { Upload, FileText, Loader2, AlertCircle } from "lucide-react"
import Papa from "papaparse"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { bulkCreateItems } from "@/app/actions"
import { InventoryItem } from "@/types/inventory"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function BulkImportModal() {
    const [open, setOpen] = useState(false)
    const [importing, setImporting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [stats, setStats] = useState<{ count: number } | null>(null)

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        setError(null)
        setStats(null)
        setImporting(true)

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results: Papa.ParseResult<any>) => {
                try {
                    const items = results.data.map((row: any) => ({
                        name: row.Name || row.name,
                        quantity: parseInt(row.Quantity || row.quantity || "0"),
                        price: parseFloat(row.Price || row.price || "0"),
                        category: row.Category || row.category || "",
                        description: row.Description || row.description || "",
                    })) as InventoryItem[]

                    const result = await bulkCreateItems(items)

                    if (result.error) {
                        setError(result.error)
                    } else {
                        setStats({ count: result.count || 0 })
                        setTimeout(() => setOpen(false), 2000)
                    }
                } catch (err) {
                    setError("Failed to process CSV file.")
                    console.error(err)
                } finally {
                    setImporting(false)
                }
            },
            error: (err: Error) => {
                setError("Failed to parse CSV file: " + err.message)
                setImporting(false)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" /> Import CSV
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Import Items via CSV</DialogTitle>
                    <DialogDescription>
                        Upload a CSV file with columns: Name, Quantity, Price, Category, Description.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {stats && (
                        <Alert className="bg-green-50 text-green-900 border-green-200">
                            <FileText className="h-4 w-4 text-green-600" />
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>
                                Successfully imported {stats.count} items!
                            </AlertDescription>
                        </Alert>
                    )}

                    {!importing && !stats && (
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        Click to upload CSV
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".csv"
                                    onChange={handleFileUpload}
                                />
                            </label>
                        </div>
                    )}

                    {importing && (
                        <div className="flex flex-col items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                            <p className="text-sm text-muted-foreground">Processing items...</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
