import { prisma } from "./db"

/**
 * Calculates total available stock for a product across all locations.
 */
export async function calculateGlobalStock(productId: string) {
    const stockLevels = await prisma.stockLevel.findMany({
        where: { productId }
    })

    const total = stockLevels.reduce((acc: number, curr: { quantity: number }) => acc + curr.quantity, 0)

    // Pending orders logic would subtract ordered-but-not-shipped items here if not reserved
    // For now, checks physical stock 'quantity'. 
    // Ideally, 'quantity' is physical, keeping 'reserved' separate is best practice, 
    // but simpler logic: Available = Quantity

    return total
}

/**
 * Routing Logic:
 * 1. Find locations with enough stock.
 * 2. Calculate distance to customer (simplified or mocked).
 * 3. Prefer closest location.
 * 4. Fallback to location with most stock (Warehouse priority).
 */
export async function routeOrder(items: { productId: string; quantity: number }[], customerLocation: { lat: number; lng: number }) {
    // Simple check for one item for now, or iterate.
    // Assume simple order: 1 item type.
    const item = items[0]
    if (!item) throw new Error("No items in order")

    const stocks = await prisma.stockLevel.findMany({
        where: {
            productId: item.productId,
            quantity: { gte: item.quantity } // Filter candidates
        },
        include: { location: true }
    })

    if (stocks.length === 0) {
        throw new Error("Out of stock globally")
    }

    // Calculate scores
    // Score = Distance (lower is better)
    // If no lat/lng, fallback to type precedence (WAREHOUSE > STORE)

    const scored = stocks.map((stock: any) => {
        let distance = Infinity
        if (stock.location.latitude && stock.location.longitude) {
            // Simple Euclidean distance for demo (Haversine better)
            const dLat = stock.location.latitude - customerLocation.lat
            const dLng = stock.location.longitude - customerLocation.lng
            distance = Math.sqrt(dLat * dLat + dLng * dLng)
        }

        return { ...stock, distance }
    })

    // Sort by distance ASC
    scored.sort((a: any, b: any) => {
        if (a.distance !== b.distance) return a.distance - b.distance
        // Tie-break: Max stock
        return b.quantity - a.quantity
    })

    return scored[0].location
}

/**
 * Process a sale event (e.g. from POS/Shopify webhook).
 * Uses a transaction to update stock and log audit.
 */
export async function processSaleEvent(input: { sku: string; quantity: number; locationId: string; externalId: string }) {
    const { sku, quantity, locationId, externalId } = input

    return await prisma.$transaction(async (tx: any) => {
        // 1. Get Product
        const product = await tx.product.findUnique({ where: { sku } })
        if (!product) throw new Error(`Product ${sku} not found`)

        // 2. Check/Update Stock
        const stock = await tx.stockLevel.findUnique({
            where: {
                productId_locationId: {
                    productId: product.id,
                    locationId
                }
            }
        })

        if (!stock || stock.quantity < quantity) {
            throw new Error(`Insufficient stock at location ${locationId}`)
        }

        await tx.stockLevel.update({
            where: { id: stock.id },
            data: { quantity: { decrement: quantity } }
        })

        // 3. Create Audit Log
        await tx.auditLog.create({
            data: {
                action: "SALE",
                entityId: product.id,
                details: `Sold ${quantity} units (Ext: ${externalId})`,
                userId: "SYSTEM_WEBHOOK"
            }
        })

        return { success: true, newQuantity: stock.quantity - quantity }
    })
}
