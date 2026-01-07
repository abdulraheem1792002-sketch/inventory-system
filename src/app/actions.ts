"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { InventoryItem, inventoryItemSchema } from "@/types/inventory"
import { logActivity } from "@/lib/logger"

export async function createItem(data: InventoryItem) {
    const result = inventoryItemSchema.safeParse(data)
    if (!result.success) {
        return { error: result.error.format() }
    }

    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: "You must be logged in to create items" }
    }

    const { error } = await supabase
        .from("inventory")
        .insert({ ...result.data, user_id: user.id })

    if (error) {
        console.error("Supabase Error:", error)
        return { error: error.message }
    }

    revalidatePath("/inventory")
    await logActivity("CREATE_ITEM", `Created item: ${result.data.name}`)
    return { success: true }
}

export async function bulkCreateItems(items: InventoryItem[]) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: "You must be logged in to import items" }
    }

    // Validate all items
    const validItems = []
    const errors = []

    for (const item of items) {
        const result = inventoryItemSchema.safeParse(item)
        if (result.success) {
            validItems.push(result.data)
        } else {
            errors.push({ item, error: result.error.format() })
        }
    }

    if (errors.length > 0) {
        return { error: "Validation failed for some items", details: errors }
    }

    const itemsWithUser = validItems.map(item => ({ ...item, user_id: user.id }))

    const { error } = await supabase.from("inventory").insert(itemsWithUser)

    if (error) {
        console.error("Supabase Error:", error)
        return { error: error.message }
    }

    revalidatePath("/inventory")
    await logActivity("BULK_CREATE", `Created ${validItems.length} items from CSV`)
    return { success: true, count: validItems.length }
}

export async function updateItem(id: string, data: InventoryItem) {
    const result = inventoryItemSchema.safeParse(data)
    if (!result.success) {
        return { error: result.error.format() }
    }

    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Unauthorized" }
    }

    const { error } = await supabase
        .from("inventory")
        .update(result.data)
        .eq("id", id)
        .eq("user_id", user.id) // Ensure user owns the item

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/inventory")
    await logActivity("UPDATE_ITEM", `Updated item: ${id}`)
    return { success: true }
}

export async function deleteItem(id: string) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Unauthorized" }
    }

    const { error } = await supabase
        .from("inventory")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id) // Ensure user owns the item

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/inventory")
    await logActivity("DELETE_ITEM", `Deleted item: ${id}`)
    return { success: true }
}
