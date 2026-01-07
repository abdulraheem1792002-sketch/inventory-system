"use client"

import { useState } from "react"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
    value?: string
    onChange: (url: string) => void
    disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)

    async function onUpload(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            const file = event.target.files?.[0]
            if (!file) return

            setUploading(true)

            const supabase = createClient()
            const fileExt = file.name.split(".").pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from("inventory-images")
                .upload(filePath, file)

            if (uploadError) {
                console.error("Upload Error Details:", uploadError)
                throw new Error(uploadError.message)
            }

            const { data } = supabase.storage
                .from("inventory-images")
                .getPublicUrl(filePath)

            onChange(data.publicUrl)
            toast.success("Image uploaded successfully")
        } catch (error) {
            console.error("Error uploading image:", error)
            toast.error("Upload failed", {
                description: error instanceof Error ? error.message : "Unknown error occurred"
            })
        } finally {
            setUploading(false)
        }
    }

    if (value) {
        return (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                <Image
                    fill
                    src={value}
                    alt="Item image"
                    className="object-cover"
                />
                <Button
                    onClick={() => onChange("")}
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    disabled={disabled}
                    type="button"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center w-full">
            <label
                className={cn(
                    "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors",
                    (disabled || uploading) && "pointer-events-none opacity-50"
                )}
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploading ? (
                        <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-2" />
                    ) : (
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    )}
                    <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                        PNG, JPG or WEBP (MAX. 2MB)
                    </p>
                </div>
                <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={onUpload}
                    disabled={disabled || uploading}
                />
            </label>
        </div>
    )
}
