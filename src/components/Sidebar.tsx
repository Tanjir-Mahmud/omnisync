"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Box, Settings, LogOut, Package2, Package } from "lucide-react"
import { removeSession } from "@/lib/auth-session"
import Image from "next/image"

const navItems = [
    {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Inventory",
        href: "/inventory",
        icon: Box,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-screen w-64 flex-col border-r border-cyan-500/20 bg-[#0a0a1f]/90 text-cyan-50 backdrop-blur-xl">
            <div className="flex items-center mb-8 px-6 py-4 border-b border-cyan-500/20">
                <div className="relative w-12 h-12 mr-3">
                    <Image
                        src="/brand-logo.png"
                        alt="OmniSync Pro Logo"
                        fill
                        className="object-contain drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                        priority
                    />
                </div>
                <h1 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400" style={{ fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 10px rgba(34,211,238,0.3)' }}>
                    OmniSync
                </h1>
            </div>
            <div className="flex-1 overflow-auto py-6">
                <nav className="grid items-start px-4 text-sm font-medium">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-300 group ${isActive
                                    ? "bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)] border border-cyan-500/30"
                                    : "text-cyan-100/60 hover:text-cyan-200 hover:bg-cyan-500/5 hover:border-cyan-500/20 border border-transparent"
                                    }`}
                            >
                                <item.icon className={`h-5 w-5 ${isActive ? "drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]" : "group-hover:text-cyan-300"}`} />
                                <span className={isActive ? "tracking-wide font-bold" : "tracking-wide"}>{item.title}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,1)] animate-pulse" />
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>
            <div className="border-t border-cyan-500/20 p-4">
                <form action={removeSession}>
                    <button
                        type="submit"
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-400 transition-all hover:bg-red-950/30 hover:text-red-300 border border-transparent hover:border-red-500/30 group"
                    >
                        <LogOut className="h-5 w-5 group-hover:drop-shadow-[0_0_5px_rgba(248,113,113,0.5)]" />
                        <span className="tracking-wide">Logout</span>
                    </button>
                </form>
            </div>
        </div >
    )
}
