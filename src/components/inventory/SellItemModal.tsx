"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { recordSale } from "@/lib/actions"
import { ShoppingCart } from "lucide-react"

type Product = {
    id: string
    name: string
    price: number
    stockLevels: { locationId: string; quantity: number }[]
}

type Location = {
    id: string
    name: string
}

export function SellItemModal({ product, locations }: { product: Product, locations: Location[] }) {
    const [open, setOpen] = useState(false)
    const [locationId, setLocationId] = useState<string>(locations[0]?.id || "")
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(false)

    // Calculate max stock for selected location
    const selectedStock = product.stockLevels.find(s => s.locationId === locationId)?.quantity || 0

    const handleSubmit = async () => {
        if (quantity > selectedStock) {
            alert("Insufficient stock at selected location.")
            return
        }

        setLoading(true)
        const res = await recordSale(product.id, locationId, quantity, product.price)
        setLoading(false)

        if (res.success) {
            setOpen(false)
            setQuantity(1)
        } else {
            alert(res.error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-green-950/40 hover:text-green-400 text-green-500/70">
                    <ShoppingCart className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#0a0a1f] border-green-500/30 text-green-50 shadow-[0_0_50px_rgba(34,197,94,0.15)]">
                <DialogHeader>
                    <DialogTitle className="text-green-100 tracking-wide text-xl">Sell Item</DialogTitle>
                    <DialogDescription className="text-green-100/50">
                        Record a sale for {product.name}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right text-green-100/70">Source</Label>
                        <Select value={locationId} onValueChange={setLocationId}>
                            <SelectTrigger className="col-span-3 bg-[#13132b]/50 border-green-500/30 text-white">
                                <SelectValue placeholder="Select Location" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0a0a1f] border-green-500/30 text-white">
                                {locations.map(loc => {
                                    const stock = product.stockLevels.find(s => s.locationId === loc.id)?.quantity || 0
                                    return (
                                        <SelectItem key={loc.id} value={loc.id}>
                                            {loc.name} (Qty: {stock})
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right text-green-100/70">Quantity</Label>
                        <Input
                            type="number"
                            min="1"
                            max={selectedStock}
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            className="col-span-3 bg-[#13132b]/50 border-green-500/30 text-white placeholder:text-white/30 focus-visible:ring-green-500/50"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right text-green-100/70">Total</Label>
                        <div className="col-span-3 text-lg font-bold text-green-400">
                            ${(quantity * product.price).toFixed(2)}
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || selectedStock === 0}
                        className="bg-green-600 hover:bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.4)] border-none w-full sm:w-auto"
                    >
                        {loading ? "Processing..." : "Confirm Sale"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
