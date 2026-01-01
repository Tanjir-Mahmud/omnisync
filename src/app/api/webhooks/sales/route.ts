import { processSaleEvent } from "@/lib/inventory-logic"
import { NextResponse } from "next/server"
import { z } from "zod"

const eventSchema = z.object({
    sku: z.string(),
    quantity: z.number().int().positive(),
    locationId: z.string().uuid(),
    externalId: z.string()
})

export async function POST(req: Request) {
    try {
        const json = await req.json()
        const body = eventSchema.parse(json)

        const result = await processSaleEvent(body)

        return NextResponse.json({ success: true, ...(result as any) })
    } catch (error) {
        console.error("Webhook error:", error)
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Invalid payload", details: (error as any).errors }, { status: 400 })
        }
        return NextResponse.json({ error: (error as Error).message }, { status: 500 })
    }
}
