"use client"

import { useState } from "react"
import { MoreHorizontal } from "lucide-react"
import { InventoryItem } from "@/types/inventory"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { deleteItem } from "../actions"
import { EditItemForm } from "./edit-item-form"

interface InventoryActionsProps {
    item: InventoryItem
}

export function InventoryActions({ item }: InventoryActionsProps) {
    const [showEditDialog, setShowEditDialog] = useState(false)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(item.id || "")}
                    >
                        Copy item ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => setShowEditDialog(true)}>
                        Edit item
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-destructive"
                        onClick={async () => {
                            if (item.id && confirm("Are you sure you want to delete this item?")) {
                                await deleteItem(item.id)
                            }
                        }}
                    >
                        Delete item
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Item</DialogTitle>
                        <DialogDescription>
                            Make changes to your item here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <EditItemForm item={item} onSuccess={() => setShowEditDialog(false)} />
                </DialogContent>
            </Dialog>
        </>
    )
}
