"use client"

import { useState } from "react"
import { Scan, TextSearch, Copy } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { BarcodeScanner } from "@/components/barcode-scanner"

export function ScannerModal() {
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleScan = (result: string) => {
        // Play beep sound
        const audio = new Audio('/beep.mp3') // Optional
        audio.play().catch(e => { })

        setOpen(false)
        // Set search param for filtering
        const params = new URLSearchParams(window.location.search)
        params.set("search", result)
        // Or if we want to add item, we could open add modal. 
        // For now, let's just alert/search. 
        // Since DataTable has client-side filtering, we might need a way to pass it. 
        // But simply showing the code is a good start, or copy to clipboard.

        if (confirm(`Scanned: ${result}. Copy to clipboard?`)) {
            navigator.clipboard.writeText(result)
            toast.success("Copied to clipboard!", {
                description: `Code: ${result}`,
                icon: <Copy className="h-4 w-4" />,
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Scan className="mr-2 h-4 w-4" /> Scanner
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Scan Barcode</DialogTitle>
                    <DialogDescription>
                        Point your camera at a barcode to scan.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-4">
                    <BarcodeScanner onResult={handleScan} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
