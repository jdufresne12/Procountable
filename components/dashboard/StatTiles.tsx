import { toneClasses } from "@/lib/helpers"
import { getStats } from "@/lib/server/dashboard"

export default async function StatTiles() {
    const stats: Stat[] = await getStats()
    console.log(stats)
    return (
        <section aria-label="Stats" className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4">
                    <span
                        className={`flex size-13 shrink-0 items-center justify-center rounded-2xl font-heading text-2xl font-bold text-slate-950 ${toneClasses[stat.tone]}`}
                    >
                        {stat.value}
                    </span>
                    <div className="flex flex-col min-w-0 gap-0.5">
                        <span className="text-[15px] font-semibold truncate">{stat.label}</span>
                        <span className="text-[13px] text-slate-500 truncate">{stat.hint}</span>
                    </div>
                </div>
            ))}
        </section>
    )
}

export function StatTilesSkeleton() {
    return (
        <div aria-hidden="true" className="grid animate-pulse gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4">
                    <div className="size-13 shrink-0 rounded-2xl bg-slate-200" />
                    <div className="flex flex-col min-w-0 gap-0.5">
                        <div className="flex h-5.5 items-center">
                            <div className="h-3.5 w-24 max-w-full rounded bg-slate-200" />
                        </div>
                        <div className="flex h-5 items-center">
                            <div className="h-3 w-36 max-w-full rounded bg-slate-100" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}