import Link from "next/link"
import Image from "next/image"
import NavLinks from "./Navlinks"
import SidebarFooter from "./SidebarFooter"
import { getNavPlans } from "@/lib/server/plans"
import { lessonHref, planHref } from "@/lib/helpers"
import { dotClasses } from "@/lib/plan-colors"


export default async function Navbar() {
    const navTree = async (): Promise<NavNode[]> => {
        const navPlans = await getNavPlans()
        return [
            { title: "Dashboard", href: "/", icon: "dashboard" },
            {
                title: "Plans",
                href: "/your-plans",
                icon: "plans",
                children: navPlans
                    ?.filter((r) => r.lifecycle === "active")
                    .map((r) => ({
                        title: r.name,
                        href: planHref(r.id),
                        dotClass: dotClasses[r.color],
                        children: r.sections.map((s) => ({
                            title: `${s.number}. ${s.title}`,
                            href: lessonHref(r.id, s.number),
                            status: s.status,
                        })),
                    })) ?? [],
            },
        ] as NavNode[]
    }

    return (
        <aside
            aria-label="Sidebar"
            className="sticky top-0 hidden h-screen w-70 shrink-0 flex-col gap-6 border-r border-slate-200/80 bg-white px-3 py-5 md:flex"
        >
            <Link
                href="/"
                aria-label="Procountable home"
                className="flex shrink-0 items-center rounded-xl px-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
                <Image src="/logo-full.svg" alt="" width={162} height={36} priority className="h-9 w-auto" />
            </Link>

            <nav aria-label="Main" className="-mx-1 flex-1 overflow-y-auto px-1">
                <NavLinks navTree={await navTree()} />
            </nav>

            <SidebarFooter />
        </aside>
    )
}