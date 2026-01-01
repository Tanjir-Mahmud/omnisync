"use server"

import { prisma } from "./db"
import { revalidatePath } from "next/cache"
import { getSession } from "./auth-session"

async function getCurrentUserId() {
    const session = await getSession()
    if (!session?.user?.email) return null
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
    })
    return user?.id
}

export async function updateStock(locationId: string, productId: string, newQuantity: number) {
    try {
        const userId = await getCurrentUserId()
        if (!userId) return { success: false, error: "Unauthorized" }

        // Verify Ownership (Product)
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { userId: true }
        })
        if (!product || product.userId !== userId) return { success: false, error: "Unauthorized access to product" }

        await prisma.stockLevel.upsert({
            where: {
                productId_locationId: {
                    productId,
                    locationId
                }
            },
            update: { quantity: newQuantity },
            create: {
                productId,
                locationId,
                quantity: newQuantity
            }
        })

        // Log audit
        await prisma.auditLog.create({
            data: {
                action: "MANUAL_UPDATE",
                entityId: productId,
                details: `Stock set to ${newQuantity} at ${locationId}`,
                userId: userId
            }
        })

        revalidatePath("/inventory")
        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error(error)
        return { success: false, error: "Failed to update stock" }
    }
}

export async function transferStock(productId: string, fromId: string, toId: string, quantity: number) {
    try {
        const userId = await getCurrentUserId()
        if (!userId) return { success: false, error: "Unauthorized" }

        if (fromId === toId) throw new Error("Source and destination must be different")

        await prisma.$transaction(async (tx: any) => {
            // Check ownership by finding the source stock
            // We assume if they can access the location/product combo they own it, but strict check is better
            const product = await tx.product.findUnique({ where: { id: productId } })
            if (!product || product.userId !== userId) throw new Error("Unauthorized product")

            // 1. Check Source Stock
            const source = await tx.stockLevel.findUnique({
                where: { productId_locationId: { productId, locationId: fromId } }
            })
            if (!source || source.quantity < quantity) throw new Error("Insufficient stock at source")

            // 2. Decrement Source
            await tx.stockLevel.update({
                where: { id: source.id },
                data: { quantity: { decrement: quantity } }
            })

            // 3. Increment Destination
            await tx.stockLevel.upsert({
                where: { productId_locationId: { productId, locationId: toId } },
                create: { productId, locationId: toId, quantity },
                update: { quantity: { increment: quantity } }
            })

            // 4. Log Transfer
            await tx.transfer.create({
                data: {
                    productId,
                    fromLocationId: fromId,
                    toLocationId: toId,
                    quantity,
                    status: "COMPLETED",
                    userId: userId
                }
            })

            // 5. Audit Log
            await tx.auditLog.create({
                data: {
                    action: "TRANSFER",
                    entityId: productId,
                    details: `Moved ${quantity} from ${fromId} to ${toId}`,
                    userId: userId
                }
            })
        })

        revalidatePath("/inventory")
        return { success: true }
    } catch (error) {
        console.error(error)
        return { success: false, error: (error as Error).message }
    }
}

export async function createProduct(data: { name: string; sku: string; price: number; minStock: number }) {
    try {
        const userId = await getCurrentUserId()
        if (!userId) return { success: false, error: "Unauthorized" }

        await prisma.product.create({
            data: {
                name: data.name,
                sku: data.sku,
                price: data.price,
                minStockLevel: data.minStock,
                description: "Newly added product",
                userId: userId
            }
        })
        revalidatePath("/inventory")
        return { success: true }
    } catch (e) {
        return { success: false, error: "Failed to create product" }
    }
}

export async function updatePrice(productId: string, price: number) {
    try {
        const userId = await getCurrentUserId()
        if (!userId) return { success: false, error: "Unauthorized" }

        const product = await prisma.product.findUnique({ where: { id: productId } })
        if (!product || product.userId !== userId) return { success: false, error: "Unauthorized" }

        await prisma.product.update({
            where: { id: productId },
            data: { price }
        })
        revalidatePath("/inventory")
        return { success: true }
    } catch (e) {
        return { success: false, error: "Failed to update price" }
    }
}

export async function deleteProduct(id: string) {
    try {
        const userId = await getCurrentUserId()
        if (!userId) return { success: false, error: "Unauthorized" }

        const product = await prisma.product.findUnique({ where: { id } })
        if (!product || product.userId !== userId) return { success: false, error: "Unauthorized" }

        // Cascade delete stock levels first
        await prisma.stockLevel.deleteMany({ where: { productId: id } })
        await prisma.product.delete({ where: { id } })

        revalidatePath("/inventory")
        revalidatePath("/")
        return { success: true }
    } catch (e) {
        return { success: false, error: "Failed to delete product" }
    }
}

export async function recordSale(productId: string, locationId: string, quantity: number, price: number) {
    try {
        const userId = await getCurrentUserId()
        if (!userId) return { success: false, error: "Unauthorized" }

        await prisma.$transaction(async (tx: any) => {
            // 1. Check Stock
            const stock = await tx.stockLevel.findUnique({
                where: { productId_locationId: { productId, locationId } }
            })
            if (!stock || stock.quantity < quantity) throw new Error("Insufficient stock")

            // 2. Decrement Stock
            await tx.stockLevel.update({
                where: { id: stock.id },
                data: { quantity: { decrement: quantity } }
            })

            // 3. Create Order
            const order = await tx.order.create({
                data: {
                    customerName: "Walk-in Customer",
                    status: "FULFILLED",
                    fulfillmentLocationId: locationId,
                    totalAmount: quantity * price,
                    userId: userId
                }
            })

            // 4. Create Order Item
            await tx.orderItem.create({
                data: {
                    orderId: order.id,
                    productId: productId,
                    quantity: quantity,
                    price: price
                }
            })

            // 5. Audit Log
            await tx.auditLog.create({
                data: {
                    action: "SALE",
                    entityId: productId,
                    details: `Sold ${quantity} units at ${locationId} for $${price}/unit`,
                    userId: userId
                }
            })
        })

        revalidatePath("/inventory")
        revalidatePath("/")
        return { success: true }
    } catch (error: any) {
        console.error("Sale Error:", error)
        return { success: false, error: error.message || "Failed to record sale" }
    }
}
