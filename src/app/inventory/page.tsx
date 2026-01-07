import { createClient } from "@/lib/supabase/server"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { AddItemModal } from "./add-item-modal"
import { DashboardStats } from "@/components/dashboard-stats"
import { InventoryOverview } from "@/components/charts/inventory-overview"
import { CategoryDistribution } from "@/components/charts/category-distribution"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { BulkImportModal } from "./bulk-import-modal"
import { ScannerModal } from "./scanner-modal"
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
        <div className="min-h-screen bg-muted/40 p-8">
            <div className="container mx-auto max-w-7xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight">
                            Inventory
                        </h1>
                        <p className="text-muted-foreground mt-2 text-lg">
                            Manage your stock and track performance.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                        <ModeToggle />
                        <form action={logout}>
                            <Button variant="ghost" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                                Log out
                            </Button>
                        </form>
                        <AddItemModal />
                        <BulkImportModal />
                        <ScannerModal />
                    </div>
                </div>

                <DashboardStats items={inventory || []} />

                <div className="grid gap-4 md:grid-cols-7 mb-8">
                    <InventoryOverview data={inventory || []} />
                    <CategoryDistribution data={inventory || []} />
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 overflow-x-auto">
                    <DataTable columns={columns} data={inventory || []} />
                </div>
            </div>
        </div>
    )
}
