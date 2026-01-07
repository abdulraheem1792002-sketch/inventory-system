"use client"

import { Suspense, useState } from "react"
import { login, signup } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSearchParams } from "next/navigation"
import { Package2, Lock, Mail, ArrowRight, User, UserCircle } from "lucide-react"

function LoginContent() {
    const [isLogin, setIsLogin] = useState(true)
    const searchParams = useSearchParams()
    const error = searchParams.get("error")

    return (
        <Card className="w-full max-w-md border-white/10 bg-white/10 text-white backdrop-blur-xl shadow-2xl">
            <CardHeader className="space-y-1 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 ring-1 ring-primary/50">
                    <Package2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">
                    {isLogin ? "Welcome back" : "Create an account"}
                </CardTitle>
                <CardDescription className="text-slate-300">
                    {isLogin
                        ? "Enter your credentials to access your inventory"
                        : "Enter your email below to create your account"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-6 rounded-md bg-red-500/15 border border-red-500/20 p-3 text-sm text-red-200 flex items-center gap-2">
                        <span>⚠️</span> {error}
                    </div>
                )}
                <form className="grid gap-4">
                    {!isLogin && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="firstName" className="text-slate-200">First Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            placeholder="John"
                                            required
                                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-primary/50 focus-visible:border-primary/50"
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lastName" className="text-slate-200">Last Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            placeholder="Doe"
                                            required
                                            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-primary/50 focus-visible:border-primary/50"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="username" className="text-slate-200">Username</Label>
                                <div className="relative">
                                    <UserCircle className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="username"
                                        name="username"
                                        placeholder="johndoe123"
                                        required
                                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-primary/50 focus-visible:border-primary/50"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-slate-200">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-primary/50 focus-visible:border-primary/50"
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-slate-200">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-primary/50 focus-visible:border-primary/50"
                            />
                        </div>
                    </div>
                    {!isLogin && (
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword" className="text-slate-200">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus-visible:ring-primary/50 focus-visible:border-primary/50"
                                />
                            </div>
                        </div>
                    )}
                    <Button
                        formAction={isLogin ? login : signup}
                        className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-200 hover:scale-[1.02]"
                    >
                        {isLogin ? "Sign In" : "Create Account"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </form>
            </CardContent>
            <CardFooter>
                <div className="text-center text-sm w-full">
                    <span className="text-slate-400">
                        {isLogin
                            ? "Don't have an account? "
                            : "Already have an account? "}
                    </span>
                    <button
                        type="button"
                        className="font-semibold text-blue-400 hover:text-blue-300 underline-offset-4 hover:underline transition-colors"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? "Sign up" : "Sign in"}
                    </button>
                </div>
            </CardFooter>
        </Card>
    )
}

export default function LoginPage() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950">
            {/* Background Effects */}
            <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
            <div className="absolute -top-40 left-0 right-0 h-96 bg-gradient-to-b from-blue-500/20 to-transparent blur-3xl opacity-30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 w-full flex justify-center px-4">
                <Suspense fallback={<div className="text-white">Loading...</div>}>
                    <LoginContent />
                </Suspense>
            </div>

            <div className="absolute bottom-8 text-slate-500 text-xs">
                © 2024 Inventory System. Secure & Fast.
            </div>
        </div>
    )
}
