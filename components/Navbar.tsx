import Link from "next/link"
import Image from "next/image"
import NavLinks from "./Navlinks"
import SidebarFooter from "./SidebarFooter"
import { Settings } from "lucide-react"

const Navbar = () => {
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
                <NavLinks />
            </nav>

            <SidebarFooter />
        </aside>
    )
}

export default Navbar