const toneClasses: Record<Stat["tone"], string> = {
    sun: "bg-sun",
    coral: "bg-coral-soft",
    mint: "bg-mint-soft",
}

const StatTiles = ({ stats }: { stats: Stat[] }) => {
    return (
        <section aria-label="Stats" className="grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4">
                    <span
                        className={`flex size-13 shrink-0 items-center justify-center rounded-2xl font-heading text-2xl font-bold text-slate-950 ${toneClasses[stat.tone]}`}
                    >
                        {stat.value}
                    </span>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[15px] font-semibold">{stat.label}</span>
                        <span className="text-[13px] text-slate-500">{stat.hint}</span>
                    </div>
                </div>
            ))}
        </section>
    )
}

export default StatTiles