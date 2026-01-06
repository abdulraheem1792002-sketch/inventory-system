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

function LoginContent() {
    const [isLogin, setIsLogin] = useState(true)
    const searchParams = useSearchParams()
    const error = searchParams.get("error")

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>{isLogin ? "Login" : "Sign Up"}</CardTitle>
                <CardDescription>
                    {isLogin
                        ? "Enter your email below to login to your account."
                        : "Create a new account to get started."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-4 rounded bg-destructive/15 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}
                <form className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" required />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button formAction={isLogin ? login : signup}>
                            {isLogin ? "Login" : "Sign Up"}
                        </Button>
                        <div className="text-center text-sm">
                            <span className="text-muted-foreground">
                                {isLogin
                                    ? "Don't have an account? "
                                    : "Already have an account? "}
                            </span>
                            <button
                                type="button"
                                className="font-medium underline hover:text-primary"
                                onClick={() => setIsLogin(!isLogin)}
                            >
                                {isLogin ? "Sign up" : "Login"}
                            </button>
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center text-xs text-muted-foreground">
                Inventory Management System
            </CardFooter>
        </Card>
    )
}

export default function LoginPage() {
    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <Suspense fallback={<div>Loading...</div>}>
                <LoginContent />
            </Suspense>
        </div>
    )
}
