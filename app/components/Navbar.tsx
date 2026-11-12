import Link from "next/link"
import InfoBubble from "./InfoBubble"

const Navbar = () => {
    return (
        <nav className="flex justify-between w-full shrink-0 bg-slate-950 px-6 py-4">
            <div className="flex items-center gap-10">
                <h1
                    className="text-2xl font-semibold tracking-tight text-white uppercase pl-5 "
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    procountable
                </h1>
                <Link href="/" className="text-white"> Dashboard </Link>
                <Link href="/your-plans" className="text-white"> Your Plans </Link>
            </div>
            <div className="flex items-center gap-10">
                <InfoBubble
                    text="12-day streak"
                    textColor="text-white"
                    color="bg-amber-600/50"
                    classNames="px-3 py-1"
                />
                <Link href="/" className="text-white"> Avatar </Link>
            </div>

        </nav>
    )
}

export default Navbar