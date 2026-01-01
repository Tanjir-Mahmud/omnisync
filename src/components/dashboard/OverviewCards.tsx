import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, AlertTriangle, ShoppingCart } from "lucide-react"
import Link from "next/link"

export function OverviewCards({
    totalStock,
    totalValue,
    lowStockCount,
    recentSales
}: {
    totalStock: number,
    totalValue: number,
    lowStockCount: number,
    recentSales: number
}) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* ... other cards unchanged ... */}
            <Link href="/inventory" className="block group">
                <Card className="bg-[#0a0a1f]/60 backdrop-blur-sm border-cyan-500/20 text-cyan-50 transition-all duration-300 hover:bg-[#0a0a1f]/80 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-cyan-100/70 tracking-widest uppercase">Total Valuation</CardTitle>
                        <DollarSign className="h-4 w-4 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white drop-shadow-md">${totalValue.toLocaleString()}</div>
                        <p className="text-xs text-cyan-100/40 mt-1">+20.1% from last month</p>
                    </CardContent>
                </Card>
            </Link>
            <Link href="/inventory" className="block group">
                <Card className="bg-[#0a0a1f]/60 backdrop-blur-sm border-purple-500/20 text-purple-50 transition-all duration-300 hover:bg-[#0a0a1f]/80 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-purple-100/70 tracking-widest uppercase">Total Items</CardTitle>
                        <Package className="h-4 w-4 text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white drop-shadow-md">{totalStock.toLocaleString()}</div>
                        <p className="text-xs text-purple-100/40 mt-1">+180 new units</p>
                    </CardContent>
                </Card>
            </Link>
            <Link href="/inventory" className="block group">
                <Card className="bg-[#0a0a1f]/60 backdrop-blur-sm border-red-500/20 text-red-50 transition-all duration-300 hover:bg-[#0a0a1f]/80 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(248,113,113,0.1)] cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-red-100/70 tracking-widest uppercase">Low Stock</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500 drop-shadow-[0_0_5px_rgba(248,113,113,0.8)]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white drop-shadow-md">{lowStockCount}</div>
                        <p className="text-xs text-red-100/40 mt-1">Requires attention</p>
                    </CardContent>
                </Card>
            </Link>
            <Link href="/inventory" className="block group">
                <Card className="bg-[#0a0a1f]/60 backdrop-blur-sm border-green-500/20 text-green-50 transition-all duration-300 hover:bg-[#0a0a1f]/80 hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-100/70 tracking-widest uppercase">Sales (24h)</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-green-400 drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white drop-shadow-md">${recentSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <p className="text-xs text-green-100/40 mt-1">Revenue generated</p>
                    </CardContent>
                </Card>
            </Link>
        </div>
    )
}
