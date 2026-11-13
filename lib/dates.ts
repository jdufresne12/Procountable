// Date helpers that take an explicit time zone

function hourIn(date: Date, timeZone: string) {
    return Number(
        new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone }).format(date),
    )
}

export function getGreeting(date: Date, timeZone: string) {
    const hour = hourIn(date, timeZone)
    if (hour >= 5 && hour < 12) return "Good morning"
    if (hour >= 12 && hour < 17) return "Good afternoon"
    return "Good evening"
}

export function formatLongDate(date: Date, timeZone: string) {
    return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        timeZone,
    })
}

export function formatMinutes(total: number) {
    const h = Math.floor(total / 60)
    const m = total % 60
    if (h === 0) return `${m}m`
    if (m === 0) return `${h}h`
    return `${h}h ${m}m`
}

// Plan dates are stored as plain "YYYY-MM-DD" strings. Formatting them in UTC
// keeps the day from shifting depending on where the server runs.
const isoToDate = (iso: string) => new Date(`${iso}T00:00:00Z`)

/** "2026-12-23" → "Dec 23" */
export function formatShortDate(iso: string) {
    return isoToDate(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
}

/** "2026-11-12" → "Thu, Nov 12" */
export function formatDayLabel(iso: string) {
    return isoToDate(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" })
}

/** Whole weeks between two ISO dates, at least 1 */
export function weeksBetween(startIso: string, endIso: string) {
    const days = (isoToDate(endIso).getTime() - isoToDate(startIso).getTime()) / 86_400_000
    return Math.max(1, Math.round(days / 7))
}
