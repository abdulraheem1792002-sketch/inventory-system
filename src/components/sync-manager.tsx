"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { getOfflineItems, removeOfflineItem } from "@/lib/offline-store"
import { createItem } from "@/app/actions"
import { useRouter } from "next/navigation"

export function SyncManager() {
    const router = useRouter()

    useEffect(() => {
        const syncItems = async () => {
            if (!navigator.onLine) return

            const offlineItems = await getOfflineItems()
            if (offlineItems.length === 0) return

            let syncedCount = 0

            toast.loading("Syncing offline items...", { id: "sync-toast" })

            for (const item of offlineItems) {
                // Strip offline/local properties
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { offlineId, timestamp, ...itemData } = item

                // Remove ID if it's empty or temporary, let server/database handle it
                if (!itemData.id) delete itemData.id;

                const result = await createItem(itemData)

                if (result.success) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    await removeOfflineItem(offlineId!)
                    syncedCount++
                } else {
                    console.error("Failed to sync item", item, result.error)
                }
            }

            toast.dismiss("sync-toast")

            if (syncedCount > 0) {
                toast.success(`Synced ${syncedCount} offline items`)
                router.refresh()
            }
        }

        window.addEventListener("online", syncItems)

        // Also try to sync on mount if online
        syncItems()

        return () => window.removeEventListener("online", syncItems)
    }, [router])

    return null
}
