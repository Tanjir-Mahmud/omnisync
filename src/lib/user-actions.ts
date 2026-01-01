"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function updateUserName(email: string, newName: string) {
    try {
        await prisma.user.update({
            where: { email },
            data: { name: newName }
        })
        revalidatePath("/")
        revalidatePath("/settings")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function deleteAllData(email: string) {
    try {
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return { success: false, error: "User not found" }

        const userId = user.id

        // Transactional Delete
        await prisma.$transaction(async (tx: any) => {
            // Delete dependent records first if not cascaded (though Prisma usually handles cascade if defined, manual is safer)
            // StockLevels cascade on Product/Location delete
            // OrderItems cascade on Order delete
            // Transfers

            await tx.transfer.deleteMany({ where: { userId } })
            await tx.order.deleteMany({ where: { userId } })

            // Products (will cascade delete stock levels)
            await tx.product.deleteMany({ where: { userId } })

            // Locations (will cascade delete remaining stock levels)
            await tx.location.deleteMany({ where: { userId } })

            // Audit Logs
            await tx.auditLog.deleteMany({ where: { userId } })
        })

        revalidatePath("/")
        revalidatePath("/inventory")
        revalidatePath("/settings")
        return { success: true }

    } catch (error: any) {
        console.error("Delete Data Error:", error)
        return { success: false, error: "Failed to delete data. Please try again." }
    }
}
