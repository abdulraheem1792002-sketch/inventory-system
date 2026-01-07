"use client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { logout } from "../auth/actions"
import { Mail } from "lucide-react"

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
                            <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Check your email</CardTitle>
                    <CardDescription>
                        You need to verify your email address to access the inventory system.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        We've sent a verification link to your email address.
                        Please check your inbox (and spam folder) and click the link to verify your account.
                    </p>
                    <div className="flex flex-col gap-2">
                        <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
                            I've verified my email
                        </Button>
                        <form action={logout}>
                            <Button variant="ghost" className="w-full">
                                Back to login
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
