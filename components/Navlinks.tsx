"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useId, useState } from "react"
import { Check, ChevronRight, Lock, Settings } from "lucide-react"
import { navTree } from "@/lib/mock-data"
import { useClerk } from "@clerk/nextjs"

// Sizes per level: top items, plans, sections
const rowSize = [
    "h-11 gap-3 rounded-xl px-3 text-[15px]",
    "h-10 gap-2.5 rounded-lg px-2.5 text-sm",
    "h-9 gap-2.5 rounded-lg px-2.5 text-[13px]",
]

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"

const NavItem = ({ node, depth }: { node: NavNode; depth: number }) => {
    const pathname = usePathname()
    const listId = useId()

    const isExact = pathname === node.href
    const isInside = node.href !== "/" && pathname.startsWith(`${node.href}/`)
    const hasChildren = !!node.children?.length

    const [open, setOpen] = useState(isInside)
    const [wasInside, setWasInside] = useState(isInside)

    if (isInside !== wasInside) {
        setWasInside(isInside)
        if (isInside) setOpen(true)
    }

    const size = rowSize[Math.min(depth, rowSize.length - 1)]
    const rowTone = isExact
        ? "bg-brand-soft"
        : `${isInside && "bg-slate-100"} hover:bg-slate-100`
    const textTone = isExact
        ? "font-semibold text-brand-ink"
        : isInside
            ? "font-semibold text-slate-900"
            : "font-medium text-slate-600 hover:text-slate-900"
    const label = <span className="min-w-0 flex-1 truncate">{node.title}</span>

    return (
        <li>
            <div className={`flex items-center rounded-xl transition-colors ${node.status === "locked" ? "" : rowTone}`}>
                {node.status === "locked" ? (
                    <span className={`flex min-w-0 flex-1 items-center text-slate-500 ${size}`}>
                        <Lock className="size-4 shrink-0" aria-hidden="true" />
                        {label}
                        <span className="sr-only">(locked)</span>
                    </span>
                ) : (
                    <Link
                        href={node.href}
                        aria-current={isExact ? "page" : undefined}
                        className={`flex min-w-0 flex-1 items-center ${size} ${textTone} ${focusRing}`}
                    >
                        {node.icon && <node.icon className="size-4.5 shrink-0" aria-hidden="true" />}
                        {node.dotClass && <span className={`size-2.5 shrink-0 rounded-lg ${node.dotClass}`} aria-hidden="true" />}
                        {node.status === "done" && (
                            <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-sun text-slate-950">
                                <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                            </span>
                        )}
                        {node.status === "current" && (
                            <span className="size-4.5 shrink-0 rounded-full border-[5px] border-brand" aria-hidden="true" />
                        )}
                        {label}
                        {depth === 0 && hasChildren && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                                {node.children!.length}
                            </span>
                        )}
                    </Link>
                )}

                {hasChildren && (
                    <button
                        type="button"
                        onClick={() => setOpen((o) => !o)}
                        aria-expanded={open}
                        aria-controls={listId}
                        aria-label={`${open ? "Hide" : "Show"} ${node.title}`}
                        className={`mr-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors ${focusRing}`}
                    >
                        <ChevronRight
                            className={`size-4 transition-transform duration-150 ${open ? "rotate-90" : ""}`}
                            aria-hidden="true"
                        />
                    </button>
                )}
            </div>

            {hasChildren && (
                <ul id={listId} hidden={!open} className="mt-0.5 ml-5 flex flex-col gap-0.5 border-l-2 border-slate-100 pl-2">
                    {node.children!.map((child) => (
                        <NavItem key={child.href} node={child} depth={depth + 1} />
                    ))}
                </ul>
            )}
        </li>
    )
}

const NavLinks = () => {
    const { openUserProfile } = useClerk()
    return (
        <ul className="flex flex-col gap-1">
            {navTree.map((node) => (
                <NavItem key={node.href} node={node} depth={0} />
            ))}

            <button
                type="button"
                onClick={() => openUserProfile()}
                className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-[15px] font-medium text-slate-600 transition-colors 
                    hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
                <Settings className="size-4.5 shrink-0" aria-hidden="true" />
                Settings
            </button>
        </ul>
    )
}

export default NavLinks