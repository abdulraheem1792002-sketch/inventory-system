"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { InventoryItem, inventoryItemSchema } from "@/types/inventory"

export async function createItem(data: InventoryItem) {
    const result = inventoryItemSchema.safeParse(data)
    if (!result.success) {
        return { error: result.error.format() }
    }

    const supabase = await createClient()
    const { error } = await supabase
        .from("inventory")
        .insert(result.data)

    if (error) {
        console.error("Supabase Error:", error)
        return { error: error.message }
    }

    revalidatePath("/inventory")
    return { success: true }
}

export async function updateItem(id: string, data: InventoryItem) {
    const result = inventoryItemSchema.safeParse(data)
    if (!result.success) {
        return { error: result.error.format() }
    }

    const supabase = await createClient()
    const { error } = await supabase
        .from("inventory")
        .update(result.data)
        .eq("id", id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/inventory")
    return { success: true }
}

export async function deleteItem(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from("inventory")
        .delete()
        .eq("id", id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/inventory")
    return { success: true }
}
