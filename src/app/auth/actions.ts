"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath("/", "layout")
    redirect("/inventory")
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const username = formData.get("username") as string

    if (password !== confirmPassword) {
        redirect(`/login?error=${encodeURIComponent("Passwords do not match")}`)
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName,
                username: username,
                full_name: `${firstName} ${lastName}`,
                role: 'staff',
            },
        },
    })

    if (error) {
        redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath("/", "layout")
    redirect("/inventory")
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()

    revalidatePath("/", "layout")
    redirect("/login")
}
