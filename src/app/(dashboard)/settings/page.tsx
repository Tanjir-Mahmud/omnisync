import { SettingsForm } from "@/components/settings/SettingsForm"
import { getSession } from "@/lib/auth-session"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
    const session = await getSession()
    if (!session?.user?.email) redirect("/login")

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    })

    if (!user) {
        // Handle edge case where user is in session but not DB
        return <div>User not found. Please contact support.</div>
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 drop-shadow-sm">Settings</h2>
                <p className="text-cyan-100/60">Manage your account settings and preferences.</p>
            </div>
            <SettingsForm userEmail={user.email} initialName={user.name || ""} />
        </div>
    )
}
