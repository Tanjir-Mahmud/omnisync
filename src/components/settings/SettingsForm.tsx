"use client"

import { useState } from "react"
import { updateUserName } from "@/lib/user-actions"
import { auth } from "@/lib/firebase"
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertTriangle, Trash2 } from "lucide-react"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteAllData } from "@/lib/user-actions"

export function SettingsForm({ userEmail, initialName }: { userEmail: string, initialName: string }) {
    const [name, setName] = useState(initialName)
    const [loadingProfile, setLoadingProfile] = useState(false)
    const [profileMessage, setProfileMessage] = useState("")

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [loadingPassword, setLoadingPassword] = useState(false)
    const [passwordMessage, setPasswordMessage] = useState("")

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoadingProfile(true)
        setProfileMessage("")

        try {
            // Update in Firebase
            const currentUser = auth.currentUser
            if (currentUser) {
                await updateProfile(currentUser, { displayName: name })
            }

            // Update in DB
            const result = await updateUserName(userEmail, name)
            if (!result.success) throw new Error(result.error)

            setProfileMessage("Profile updated successfully!")
        } catch (error: any) {
            setProfileMessage(`Error: ${error.message}`)
        } finally {
            setLoadingProfile(false)
        }
    }

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoadingPassword(true)
        setPasswordMessage("")

        try {
            const user = auth.currentUser
            if (!user || !user.email) throw new Error("No user logged in")

            // Re-authenticate
            const credential = EmailAuthProvider.credential(user.email, currentPassword)
            await reauthenticateWithCredential(user, credential)

            // Update Password
            await updatePassword(user, newPassword)

            setPasswordMessage("Password updated successfully!")
            setCurrentPassword("")
            setNewPassword("")
        } catch (error: any) {
            setPasswordMessage(`Error: ${error.message}`)
        } finally {
            setLoadingPassword(false)
        }
    }

    return (
        <div className="grid gap-6">
            <Card className="bg-[#0a0a1f]/60 backdrop-blur-sm border-cyan-500/20 text-cyan-50 shadow-[0_0_15px_rgba(34,211,238,0.05)]">
                <CardHeader>
                    <CardTitle className="text-cyan-100 tracking-wide">Profile Information</CardTitle>
                    <CardDescription className="text-cyan-100/50">Update your account details.</CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateProfile}>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="className" className="text-cyan-100/70">Full Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-[#13132b]/50 border-cyan-500/30 text-white placeholder:text-white/30 focus-visible:ring-cyan-500/50"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-cyan-100/70">Email Address (Read-only)</Label>
                            <Input
                                id="email"
                                value={userEmail}
                                disabled
                                className="bg-[#13132b]/30 border-cyan-500/10 text-white/50 cursor-not-allowed"
                            />
                        </div>
                        {profileMessage && <p className={`text-sm ${profileMessage.includes("Error") ? "text-red-400" : "text-green-400"}`}>{profileMessage}</p>}
                    </CardContent>
                    <CardFooter className="pt-6">
                        <Button disabled={loadingProfile} type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_10px_rgba(34,211,238,0.4)] border-none">
                            {loadingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <Card className="bg-[#0a0a1f]/60 backdrop-blur-sm border-purple-500/20 text-purple-50 shadow-[0_0_15px_rgba(168,85,247,0.05)]">
                <CardHeader>
                    <CardTitle className="text-purple-100 tracking-wide">Security</CardTitle>
                    <CardDescription className="text-purple-100/50">Change your password.</CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdatePassword}>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="current-password" className="text-purple-100/70">Current Password</Label>
                            <Input
                                id="current-password"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="bg-[#13132b]/50 border-purple-500/30 text-white placeholder:text-white/30 focus-visible:ring-purple-500/50"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="new-password" className="text-purple-100/70">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="bg-[#13132b]/50 border-purple-500/30 text-white placeholder:text-white/30 focus-visible:ring-purple-500/50"
                                required
                            />
                        </div>
                        {passwordMessage && <p className={`text-sm ${passwordMessage.includes("Error") ? "text-red-400" : "text-green-400"}`}>{passwordMessage}</p>}
                    </CardContent>
                    <CardFooter className="pt-6">
                        <Button disabled={loadingPassword} type="submit" className="bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)] border-none">
                            {loadingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Password
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <Card className="bg-red-950/20 backdrop-blur-sm border-red-500/20 text-red-50 shadow-[0_0_15px_rgba(220,38,38,0.05)]">
                <CardHeader>
                    <CardTitle className="text-red-400 tracking-wide flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Danger Zone
                    </CardTitle>
                    <CardDescription className="text-red-200/50">Irreversible actions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-red-100/70">
                        Deleting your data will remove all products, inventory levels, order history, and settings configuration.
                        This action cannot be undone.
                    </p>
                    <DeleteDataDialog userEmail={userEmail} />
                </CardContent>
            </Card>
        </div>
    )
}

function DeleteDataDialog({ userEmail }: { userEmail: string }) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        setLoading(true)
        const res = await deleteAllData(userEmail)
        setLoading(false)
        if (res.success) {
            alert("All data has been deleted.")
            window.location.href = "/" // Reload
        } else {
            alert("Error: " + res.error)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/50 w-full sm:w-auto">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete All Data
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#0a0a1f] border-red-500/30 text-white">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-400">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-slate-300">
                        This action cannot be undone. This will permanently delete your inventory, transaction history, and reset your account to a clean state.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white border-none">
                        {loading ? "Deleting..." : "Yes, Delete Everything"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
