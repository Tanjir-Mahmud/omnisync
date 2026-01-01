"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { updateStock, deleteProduct, updatePrice } from "@/lib/actions"
import { useState } from "react"
import { TransferModal } from "./TransferModal"
import { AddProductModal } from "./AddProductModal"
import { SellItemModal } from "./SellItemModal"
import { Trash2, AlertTriangle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

type ProductWithStock = {
    id: string
    sku: string
    name: string
    price: number
    minStockLevel: number
    stockLevels: {
        locationId: string
        quantity: number
    }[]
}

type Location = {
    id: string
    name: string
    type: string
}

export function InventoryGrid({ products, locations }: { products: ProductWithStock[], locations: Location[] }) {
    const [loading, setLoading] = useState<string | null>(null)

    const handleUpdate = async (productId: string, locationId: string, value: string) => {
        const qty = parseInt(value)
        if (isNaN(qty) || qty < 0) return

        setLoading(`${productId}-${locationId}`)
        await updateStock(locationId, productId, qty)
        setLoading(null)
    }

    const handlePriceUpdate = async (productId: string, value: string) => {
        const price = parseFloat(value)
        if (isNaN(price) || price < 0) return

        setLoading(`${productId}-price`)
        await updatePrice(productId, price)
        setLoading(null)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This will delete all history for this product.")) return
        await deleteProduct(id)
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <AddProductModal />
            </div>
            <div className="rounded-md border border-cyan-500/20 bg-[#0a0a1f]/60 backdrop-blur-sm overflow-hidden shadow-[0_0_15px_rgba(34,211,238,0.05)]">
                <Table>
                    <TableHeader className="bg-cyan-950/30">
                        <TableRow className="hover:bg-cyan-900/20 border-cyan-500/20">
                            <TableHead className="text-cyan-400 font-bold uppercase tracking-wider">SKU</TableHead>
                            <TableHead className="text-cyan-400 font-bold uppercase tracking-wider">Product Name</TableHead>
                            <TableHead className="text-cyan-400 font-bold uppercase tracking-wider">Price</TableHead>
                            <TableHead className="text-cyan-400 font-bold uppercase tracking-wider">Actions</TableHead>
                            {locations.map(loc => (
                                <TableHead key={loc.id} className="text-center text-purple-400 font-bold uppercase tracking-wider">{loc.name} ({loc.type})</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => {
                            const totalQty = product.stockLevels.reduce((a, b) => a + b.quantity, 0)
                            const isLowStock = totalQty <= product.minStockLevel

                            return (
                                <TableRow key={product.id} className={`border-cyan-500/10 hover:bg-cyan-900/10 transition-colors ${isLowStock ? "bg-red-950/20 border-red-500/30" : ""}`}>
                                    <TableCell className="font-medium text-cyan-50 font-mono">
                                        {product.sku}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-cyan-50">
                                            {product.name}
                                            {isLowStock && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
                                                        </TooltipTrigger>
                                                        <TooltipContent className="bg-red-950 text-red-100 border-red-500">
                                                            <p>Low Stock! (Total: {totalQty} &lt; Min: {product.minStockLevel})</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-cyan-200">
                                            <span>$</span>
                                            <Input
                                                type="number"
                                                defaultValue={product.price}
                                                className="w-24 h-8 bg-[#13132b]/50 border-cyan-500/30 text-white placeholder:text-white/30 focus-visible:ring-cyan-500/50"
                                                onBlur={(e) => handlePriceUpdate(product.id, e.target.value)}
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <div className="scale-90">
                                                <SellItemModal product={product} locations={locations} />
                                            </div>
                                            {locations.length > 1 && (
                                                <div className="scale-90">
                                                    <TransferModal product={product} locations={locations} />
                                                </div>
                                            )}
                                            <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="hover:bg-red-950/40 hover:text-red-400 text-red-500/70">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    {locations.map(loc => {
                                        const stock = product.stockLevels.find(s => s.locationId === loc.id)
                                        const qty = stock ? stock.quantity : 0

                                        return (
                                            <TableCell key={loc.id}>
                                                <div className="flex items-center justify-center gap-2">
                                                    <Input
                                                        type="number"
                                                        defaultValue={qty}
                                                        className="w-20 bg-[#13132b]/50 border-purple-500/30 text-white placeholder:text-white/30 focus-visible:ring-purple-500/50 text-center"
                                                        onBlur={(e) => {
                                                            if (parseInt(e.target.value) !== qty) {
                                                                handleUpdate(product.id, loc.id, e.target.value)
                                                            }
                                                        }}
                                                    />
                                                    {loading === `${product.id}-${loc.id}` && <span className="text-xs text-cyan-400 animate-pulse">Saving...</span>}
                                                </div>
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
