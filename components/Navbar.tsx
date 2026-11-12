import Link from "next/link"
import Image from "next/image"
import { Show, SignInButton, UserButton } from "@clerk/nextjs"
import { Flame } from "lucide-react"
import NavLinks from "./Navlinks"
import InfoBubble from "./InfoBubble"

const Navbar = () => {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur supports-backdrop-filter:bg-white/70">
            <nav aria-label="Main" className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:gap-8 sm:px-6">
                {/* Logo */}
                <Link
                    href="/"
                    aria-label="Procountable home"
                    className="flex shrink-0 items-center gap-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                >
                    {/* Full logo on tablet and up, icon only on phones */}
                    <Image
                        src="/logo-full.svg"
                        alt=""
                        width={162}
                        height={36}
                        priority
                        className="hidden h-9 w-auto sm:block"
                    />
                    <Image
                        src="/logo-mark.svg"
                        alt=""
                        width={36}
                        height={36}
                        priority
                        className="h-9 w-9 sm:hidden"
                    />
                </Link>

                {/* Main links */}
                <Show when="signed-in">
                    <NavLinks />
                </Show>

                {/* Right side */}
                <div className="ml-auto flex items-center gap-2 sm:gap-3">
                    <Show when="signed-in">
                        <InfoBubble
                            text="12-day streak"
                            icon={Flame}
                            color="bg-amber-100"
                            textColor="text-amber-900"
                            classNames="hidden h-10 px-3.5 md:inline-flex"
                        />

                        <div className="ml-1 flex h-10 items-center">
                            <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
                        </div>
                    </Show>

                    <Show when="signed-out">
                        <SignInButton>
                            <button
                                type="button"
                                className="inline-flex h-10 items-center rounded-xl bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                            >
                                Sign in
                            </button>
                        </SignInButton>
                    </Show>
                </div>
            </nav>
        </header>
    )
}

export default Navbar