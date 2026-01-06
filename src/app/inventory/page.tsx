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
        <div className="min-h-screen bg-slate-50/50 p-8">
            <div className="container mx-auto max-w-7xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                            Inventory
                        </h1>
                        <p className="text-muted-foreground mt-2 text-lg">
                            Manage your stock and track performance.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <form action={logout}>
                            <Button variant="ghost" className="text-slate-600 hover:text-red-600 hover:bg-red-50">
                                Log out
                            </Button>
                        </form>
                        <AddItemModal />
                    </div>
                </div>

                <DashboardStats items={inventory || []} />

                <div className="rounded-xl border bg-white shadow-sm p-6 overflow-hidden">
                    <DataTable columns={columns} data={inventory || []} />
                </div>
            </div>
        </div>
    )
}
