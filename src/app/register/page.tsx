'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from 'react';
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { createSession } from "@/lib/auth-session";
import { useRouter } from 'next/navigation';
import { Package } from "lucide-react";
import Image from "next/image";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
            await createSession(email, name);
            // Force hard navigation to ensure cookies are read by server
            window.location.href = "/";
        } catch (err: any) {
            setError(err.message || "Failed to register");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 cyberpunk-bg text-white relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[10%] left-[10%] w-60 h-60 bg-purple-600/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-blue-600/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="mb-8 z-10 flex flex-col items-center gap-4">
                <div className="relative w-32 h-32">
                    <Image
                        src="/brand-logo.png"
                        alt="OmniSync Pro"
                        fill
                        className="object-contain drop-shadow-[0_0_25px_rgba(168,85,247,0.6)] animate-pulse-slow"
                        priority
                    />
                </div>
                <h1 className="text-4xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400" style={{ fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 15px rgba(34,211,238,0.5)' }}>
                    OmniSync Pro
                </h1>
            </div>
            <Card className="w-full max-w-md bg-[#0a0a1f]/80 border-purple-500/30 backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.15)] z-10">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl font-bold tracking-wider text-cyan-400 uppercase drop-shadow-md">
                        Sign Up
                    </CardTitle>
                </CardHeader>
                <form onSubmit={handleRegister}>
                    <CardContent className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-xs font-bold text-cyan-100/70 tracking-wider uppercase">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="JHON DOE"
                                required
                                className="bg-[#13132b] border-purple-500/30 text-white placeholder:text-white/30 focus-visible:ring-cyan-500/50 h-12"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-xs font-bold text-cyan-100/70 tracking-wider uppercase">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                className="bg-[#13132b] border-purple-500/30 text-white placeholder:text-white/30 focus-visible:ring-cyan-500/50 h-12"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-xs font-bold text-cyan-100/70 tracking-wider uppercase">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="bg-[#13132b] border-purple-500/30 text-white placeholder:text-white/30 focus-visible:ring-cyan-500/50 h-12"
                            />
                        </div>

                        <div className="flex items-center space-x-2 my-2">
                            <input type="checkbox" id="terms" className="rounded bg-[#13132b] border-purple-500/50 text-cyan-500 focus:ring-cyan-500/50" />
                            <label htmlFor="terms" className="text-sm text-cyan-100/70 font-light">
                                I agree to the <span className="text-cyan-400 cursor-pointer hover:underline">Terms & Conditions</span>
                            </label>
                        </div>

                        {error && (
                            <p className="text-sm text-red-400 bg-red-950/30 p-2 rounded border border-red-900/50 text-center animate-pulse">{error}</p>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold tracking-widest shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] uppercase border-none"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Account'}
                        </Button>
                        <div className="text-center text-sm text-cyan-100/60">
                            Already have an account?{" "}
                            <a href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline transition-colors">
                                Login
                            </a>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
