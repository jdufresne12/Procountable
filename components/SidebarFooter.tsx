"use client"

import { SignOutButton, useClerk, useUser } from "@clerk/nextjs"
import { LogOut, Settings } from "lucide-react"

const row =
    "flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-[15px] font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"

const SidebarFooter = () => {
    const { user } = useUser()

    return (
        <div className="flex flex-col gap-1">
            {user && (
                <div className="mb-1.5 flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2.5">
                    <img src={user.imageUrl} alt="" className="size-9 shrink-0 rounded-full object-cover" />
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                            {user.fullName ?? user.username ?? "Your account"}
                        </p>
                        <p className="truncate text-xs text-slate-500">{user.primaryEmailAddress?.emailAddress}</p>
                    </div>
                </div>
            )}

            <hr className="my-1.5 border-slate-200" />

            {/* Redirects to afterSignOutUrl set on <ClerkProvider> */}
            <SignOutButton>
                <button type="button" className={row}>
                    <LogOut className="size-4.5 shrink-0" aria-hidden="true" />
                    Sign out
                </button>
            </SignOutButton>
        </div>
    )
}

export default SidebarFooter