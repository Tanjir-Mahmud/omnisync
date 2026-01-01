'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { useState } from 'react';
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { createSession } from "@/lib/auth-session";
import { useRouter } from 'next/navigation';
import { Package } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await createSession(userCredential.user.email!, userCredential.user.displayName || undefined);
            window.location.href = "/"; // Force hard navigation
        } catch (err: any) {
            setError(err.message || "Failed to login");
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError("");
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            await createSession(result.user.email!, result.user.displayName || undefined);
            window.location.href = "/"; // Force hard navigation
        } catch (err: any) {
            setError(err.message || "Google login failed");
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 cyberpunk-bg text-white relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[20%] right-[20%] w-72 h-72 bg-green-600/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[20%] left-[10%] w-60 h-60 bg-teal-600/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="mb-8 z-10 flex flex-col items-center gap-4">
                <div className="relative w-32 h-32">
                    <Image
                        src="/brand-logo.png"
                        alt="OmniSync Pro"
                        fill
                        className="object-contain drop-shadow-[0_0_25px_rgba(34,211,238,0.6)] animate-pulse-slow"
                        priority
                    />
                </div>
                <h1 className="text-4xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400" style={{ fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 15px rgba(34,211,238,0.5)' }}>
                    OmniSync Pro
                </h1>
            </div>

            <Card className="w-full max-w-md bg-[#0a0a1f]/80 border-green-500/30 backdrop-blur-md shadow-[0_0_30px_rgba(34,197,94,0.15)] z-10">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl font-bold tracking-wider text-green-400 uppercase drop-shadow-md">
                        Log In
                    </CardTitle>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-xs font-bold text-green-100/70 tracking-wider uppercase">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                className="bg-[#13132b] border-green-500/30 text-white placeholder:text-white/30 focus-visible:ring-green-500/50 h-12"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-xs font-bold text-green-100/70 tracking-wider uppercase">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="bg-[#13132b] border-green-500/30 text-white placeholder:text-white/30 focus-visible:ring-green-500/50 h-12"
                            />
                        </div>

                        <div className="flex items-center justify-between my-2">
                            <div className="flex items-center space-x-2">
                                <input type="checkbox" id="remember" className="rounded bg-[#13132b] border-green-500/50 text-green-500 focus:ring-green-500/50" />
                                <label htmlFor="remember" className="text-sm text-green-100/70 font-light">
                                    Remember me
                                </label>
                            </div>
                            <span className="text-sm text-green-400 hover:text-green-300 cursor-pointer transition-colors">Forgot Password?</span>
                        </div>

                        {error && (
                            <p className="text-sm text-red-400 bg-red-950/30 p-2 rounded border border-red-900/50 text-center animate-pulse">{error}</p>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            className="w-full h-12 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white font-bold tracking-widest shadow-[0_0_20px_rgba(20,184,166,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] uppercase border-none"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </Button>

                        <div className="w-full flex items-center gap-3">
                            <div className="h-[1px] bg-green-500/20 flex-1"></div>
                            <span className="text-xs text-green-100/50 uppercase tracking-wide">Or continue with</span>
                            <div className="h-[1px] bg-green-500/20 flex-1"></div>
                        </div>

                        <Button type="button" variant="outline" className="w-full h-12 border-green-500/30 bg-[#13132b]/50 hover:bg-green-950/30 text-green-100 hover:text-green-400" onClick={handleGoogleLogin} disabled={loading}>
                            Google
                        </Button>

                        <div className="text-center text-sm text-green-100/60">
                            Don't have an account?{" "}
                            <a href="/register" className="text-green-400 hover:text-green-300 font-semibold hover:underline transition-colors">
                                Sign up
                            </a>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
