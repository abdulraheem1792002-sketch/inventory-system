import { createClient } from "@/lib/supabase/server"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { AddItemModal } from "./add-item-modal"
import { DashboardStats } from "@/components/dashboard-stats"
import { Button } from "@/components/ui/button"
import { logout } from "../auth/actions"

export const dynamic = 'force-dynamic'

export default async function InventoryPage() {
    const supabase = await createClient()
    const { data: inventory, error } = await supabase
        .from("inventory")
        .select("*")
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching inventory:", error)
    }

    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
                    <p className="text-muted-foreground">
                        Manage your inventory items, stock levels, and prices.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <form action={logout}>
                        <Button variant="outline">Logout</Button>
                    </form>
                    <AddItemModal />
                </div>
            </div>
            <DashboardStats items={inventory || []} />
            <DataTable columns={columns} data={inventory || []} />
        </div>
    )
}
