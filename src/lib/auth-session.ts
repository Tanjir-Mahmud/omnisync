"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "./db"

export async function createSession(email: string, name?: string) {
    // Set a simple session cookie
    // In a real production app, verify the Firebase ID Token with Admin SDK here
    (await cookies()).set("session", email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
    })

    // Sync user to Prisma DB
    if (email) {
        await prisma.user.upsert({
            where: { email },
            update: { name: name || undefined },
            create: {
                email,
                name: name || "Firebase User",
                password: "firebase_managed" // Placeholder
            }
        })
    }

    return { success: true }
}

export async function removeSession() {
    (await cookies()).delete("session")
    redirect("/login")
}

export async function getSession() {
    const sessionCookie = (await cookies()).get("session")
    if (!sessionCookie?.value) return null
    return { user: { email: sessionCookie.value } }
}
