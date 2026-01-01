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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { transferStock } from "@/lib/actions"
import { ArrowRightLeft } from "lucide-react"

export function TransferModal({
    product,
    locations
}: {
    product: { id: string, name: string },
    locations: { id: string, name: string }[]
}) {
    const [open, setOpen] = useState(false)
    const [fromId, setFromId] = useState("")
    const [toId, setToId] = useState("")
    const [qty, setQty] = useState(1)
    const [loading, setLoading] = useState(false)

    const handleTransfer = async () => {
        if (!fromId || !toId || fromId === toId) return
        setLoading(true)
        const res = await transferStock(product.id, fromId, toId, qty)
        setLoading(false)
        if (res.success) {
            setOpen(false)
        } else {
            alert(res.error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-blue-950/40 hover:text-blue-400 text-blue-500/70">
                    <ArrowRightLeft className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#0a0a1f] border-blue-500/30 text-blue-50 shadow-[0_0_50px_rgba(59,130,246,0.15)]">
                <DialogHeader>
                    <DialogTitle className="text-blue-100 tracking-wide text-xl">Transfer Stock</DialogTitle>
                    <DialogDescription className="text-blue-100/50">
                        Move {product.name} between locations.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right text-blue-100/70">From</Label>
                        <Select onValueChange={setFromId}>
                            <SelectTrigger className="col-span-3 bg-[#13132b]/50 border-blue-500/30 text-white">
                                <SelectValue placeholder="Select Source" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0a0a1f] border-blue-500/30 text-white">
                                {locations.map(l => (
                                    <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right text-blue-100/70">To</Label>
                        <Select onValueChange={setToId}>
                            <SelectTrigger className="col-span-3 bg-[#13132b]/50 border-blue-500/30 text-white">
                                <SelectValue placeholder="Select Destination" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0a0a1f] border-blue-500/30 text-white">
                                {locations.map(l => (
                                    <SelectItem key={l.id} value={l.id} disabled={l.id === fromId}>{l.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="qty" className="text-right text-blue-100/70">Quantity</Label>
                        <Input
                            id="qty"
                            type="number"
                            value={qty}
                            onChange={(e) => setQty(parseInt(e.target.value))}
                            className="col-span-3 bg-[#13132b]/50 border-blue-500/30 text-white placeholder:text-white/30 focus-visible:ring-blue-500/50"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleTransfer}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)] border-none w-full sm:w-auto"
                    >
                        {loading ? "Transferring..." : "Confirm Transfer"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
