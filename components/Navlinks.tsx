"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
    { href: "/", label: "Dashboard" },
    { href: "/your-plans", label: "Your plans" },
]

const NavLinks = () => {
    const pathname = usePathname()

    return (
        <ul className="flex items-center gap-1">
            {links.map(({ href, label }) => {
                // "/" only matches exactly; other links also stay active on their sub-pages
                const isActive =
                    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)

                return (
                    <li key={href}>
                        <Link
                            href={href}
                            aria-current={isActive ? "page" : undefined}
                            className={`inline-flex h-10 items-center rounded-xl px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${isActive
                                    ? "bg-brand-soft text-brand-ink font-semibold"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                        >
                            {label}
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}

export default NavLinks