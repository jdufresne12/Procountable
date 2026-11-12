// Full class names (not built from strings) so Tailwind can find them.
export const planColorClasses: Record<PlanColor, { swatch: string; bar: string; chip: string }> = {
    violet: { swatch: "bg-brand/45", bar: "bg-brand", chip: "bg-brand-soft text-brand-ink" },
    sun: { swatch: "bg-sun", bar: "bg-sun-ink/70", chip: "bg-sun-soft text-sun-ink" },
    coral: { swatch: "bg-coral/60", bar: "bg-coral", chip: "bg-coral-soft text-coral-ink" },
}

export const neutralChip = "bg-slate-100 text-slate-700"