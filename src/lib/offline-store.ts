import { openDB, DBSchema } from 'idb';
import { InventoryItem } from '@/types/inventory';

interface OfflineDB extends DBSchema {
    items: {
        key: string;
        value: InventoryItem & { offlineId?: string; timestamp: number };
    };
}

const DB_NAME = 'inventory-offline-db';
const STORE_NAME = 'items';

export async function initDB() {
    return openDB<OfflineDB>(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'offlineId' });
            }
        },
    });
}

export async function saveOfflineItem(item: InventoryItem) {
    const db = await initDB();
    const offlineId = crypto.randomUUID();
    await db.put(STORE_NAME, {
        ...item,
        offlineId,
        timestamp: Date.now(),
    });
    return offlineId;
}

export async function getOfflineItems() {
    const db = await initDB();
    return db.getAll(STORE_NAME);
}

export async function removeOfflineItem(offlineId: string) {
    const db = await initDB();
    await db.delete(STORE_NAME, offlineId);
}

export async function clearOfflineItems() {
    const db = await initDB();
    await db.clear(STORE_NAME);
}
