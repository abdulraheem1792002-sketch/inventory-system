"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { saveOfflineItem } from "@/lib/offline-store"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/image-upload"
import { createItem } from "@/app/actions"
import { inventoryItemSchema, InventoryItem } from "@/types/inventory"

interface AddItemFormProps {
    onSuccess: () => void
}

export function AddItemForm({ onSuccess }: AddItemFormProps) {
    const [loading, setLoading] = useState(false)
    const form = useForm<InventoryItem>({
        resolver: zodResolver(inventoryItemSchema) as any,
        defaultValues: {
            name: "",
            quantity: 0,
            price: 0,
            category: "",
            description: "",
            image_url: "",
        },
    })

    async function onSubmit(data: InventoryItem) {
        setLoading(true)

        // Helper to save offline
        const saveToOffline = async () => {
            try {
                await saveOfflineItem(data)
                toast("Saved offline", {
                    description: "Item will be synced when you are back online",
                })
                form.reset()
                onSuccess()
            } catch (error) {
                console.error("Failed to save offline", error)
                toast.error("Failed to save offline")
            }
        }

        if (!navigator.onLine) {
            await saveToOffline()
            setLoading(false)
            return
        }

        try {
            const result = await createItem(data)

            if (result.error) {
                console.error("Server Action Error:", result.error)

                // If error suggests auth/connection issue, fallback to offline
                const errorStr = JSON.stringify(result.error)
                if (errorStr.includes("logged in") || errorStr.includes("Unauthorized") || errorStr.includes("fetch")) {
                    toast("Connection failed. Saving offline...", { icon: "📡" })
                    await saveToOffline()
                } else {
                    toast.error("Failed to create item")
                }
            } else {
                form.reset()
                onSuccess()
            }
        } catch (error) {
            // Catches network errors (e.g. server down)
            console.error("Network error submitting form:", error)
            toast("Network error. Saving offline...", { icon: "📡" })
            await saveToOffline()
        }

        setLoading(false)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                                <ImageUpload
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={loading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Item name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="0" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <Input placeholder="Category" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Item description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Add Item"
                    )}
                </Button>
            </form>
        </Form>
    )
}
