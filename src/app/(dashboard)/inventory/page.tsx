import { getSession } from "@/lib/auth-session"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { InventoryGrid } from "@/components/inventory/InventoryGrid"

export default async function InventoryPage() {
    const session = await getSession()
    if (!session?.user?.email) redirect("/login")

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    const userId = user?.id

    if (!userId) {
        return <div>Error loading user profile.</div>
    }

    // Auto-seed default location if none exist
    const locationCount = await prisma.location.count({ where: { userId } })
    if (locationCount === 0) {
        await prisma.location.create({
            data: {
                name: "Main Warehouse",
                type: "WAREHOUSE",
                userId: userId
            }
        })
    }

    const locations = await prisma.location.findMany({
        where: { userId },
        orderBy: { type: 'asc' } // Warehouse first
    })

    const products = await prisma.product.findMany({
        where: { userId },
        include: {
            stockLevels: true
        }
    })

    return (
        <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 drop-shadow-sm">Inventory Management</h2>
                    <p className="text-cyan-100/60">Real-time stock control across {locations.length} locations</p>
                </div>
            </div>

            <InventoryGrid products={products} locations={locations} />
        </div>
    )
}
