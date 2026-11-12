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