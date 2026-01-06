import { z } from "zod"

export const inventoryItemSchema = z.object({
    id: z.string().uuid().optional(), // Optional for creation, required for reading
    name: z.string().min(2, "Name must be at least 2 characters"),
    quantity: z.coerce.number().int().min(0, "Quantity must be 0 or greater"),
    price: z.coerce.number().min(0, "Price must be 0 or greater"),
    category: z.string().optional(),
    description: z.string().optional(),
    created_at: z.string().optional(),
})

export type InventoryItem = z.infer<typeof inventoryItemSchema>
