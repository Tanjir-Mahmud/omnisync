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
import { useState } from "react"
import { createProduct } from "@/lib/actions"
import { Plus } from "lucide-react"

export function AddProductModal() {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [sku, setSku] = useState("")
    const [price, setPrice] = useState(0)
    const [minStock, setMinStock] = useState(5)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setLoading(true)
        const res = await createProduct({ name, sku, price, minStock })
        setLoading(false)
        if (res.success) {
            setOpen(false)
            setName("")
            setSku("")
            setPrice(0)
        } else {
            alert(res.error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_10px_rgba(34,211,238,0.4)] border-none">
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#0a0a1f] border-cyan-500/30 text-cyan-50 shadow-[0_0_50px_rgba(34,211,238,0.15)]">
                <DialogHeader>
                    <DialogTitle className="text-cyan-100 tracking-wide text-xl">Add New Product</DialogTitle>
                    <DialogDescription className="text-cyan-100/50">
                        Create a new item in the centralized matrix.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right text-cyan-100/70">Name</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="col-span-3 bg-[#13132b]/50 border-cyan-500/30 text-white placeholder:text-white/30 focus-visible:ring-cyan-500/50"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right text-cyan-100/70">SKU</Label>
                        <Input
                            value={sku}
                            onChange={(e) => setSku(e.target.value)}
                            className="col-span-3 bg-[#13132b]/50 border-cyan-500/30 text-white placeholder:text-white/30 focus-visible:ring-cyan-500/50"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right text-cyan-100/70">Price</Label>
                        <Input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(parseFloat(e.target.value))}
                            className="col-span-3 bg-[#13132b]/50 border-cyan-500/30 text-white placeholder:text-white/30 focus-visible:ring-cyan-500/50"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right text-cyan-100/70">Min Stock</Label>
                        <Input
                            type="number"
                            value={minStock}
                            onChange={(e) => setMinStock(parseInt(e.target.value))}
                            className="col-span-3 bg-[#13132b]/50 border-cyan-500/30 text-white placeholder:text-white/30 focus-visible:ring-cyan-500/50"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)] border-none w-full sm:w-auto"
                    >
                        {loading ? "Creating..." : "Create Product"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
