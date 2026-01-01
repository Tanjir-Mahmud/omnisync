import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
    const products = await prisma.product.findMany({
        include: { stockLevels: { include: { location: true } } }
    })

    // CSV Header
    let csv = "SKU,Product Name,Total Stock,Value,Low Stock?\n"

    products.forEach((p: any) => {
        const totalStock = p.stockLevels.reduce((a: number, b: { quantity: number }) => a + b.quantity, 0)
        const value = (totalStock * p.price).toFixed(2)
        const lowStock = totalStock <= p.minStockLevel ? "YES" : "NO"

        // E.g: SKU, Name, Stock, Value, Low
        csv += `${p.sku},"${p.name}",${totalStock},${value},${lowStock}\n`
    })

    return new NextResponse(csv, {
        headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="inventory-report-${Date.now()}.csv"`
        }
    })
}
