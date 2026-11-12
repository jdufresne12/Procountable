import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { alsoToday, getPlan, mockUser, plans, redoQueue, stats, upNext, week } from "@/lib/mock-data"
import { formatLongDate, formatMinutes, getGreeting } from "@/lib/dates"
import UpNextCard from "@/components/dashboard/UpNextCard"
import AlsoToday from "@/components/dashboard/AlsoToday"
import StatTiles from "@/components/dashboard/StatTiles"
import WeekCalendar from "@/components/dashboard/WeekCalender"
import ActivePlans from "@/components/dashboard/ActivePlans"

export default async function Home() {
  const user = await currentUser()
  if (!user) redirect("/sign-in")

  const now = new Date()
  const { timeZone } = mockUser

  const todaysSessions = [upNext, ...alsoToday]
  const totalMinutes = upNext.minutesLeft + alsoToday.reduce((sum, s) => sum + s.minutes, 0)
  const planCount = new Set(todaysSessions.map((s) => s.planId)).size

  const upNextPlan = getPlan(upNext.planId)

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:py-10">
      <header className="flex flex-col gap-1.5">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {getGreeting(now, timeZone)}
          {user.firstName ? `, ${user.firstName}` : ""}
        </h1>
        <p className="text-[15px] text-slate-500">{formatLongDate(now, timeZone)}</p>
      </header>

      <section aria-labelledby="today-heading" className="flex flex-col gap-3.5">
        <div className="flex flex-wrap items-baseline gap-3">
          <h2 id="today-heading" className="font-heading text-2xl font-bold">
            Today
          </h2>
          <p className="text-[15px] text-slate-500">
            {todaysSessions.length} sessions · about {formatMinutes(totalMinutes)} across {planCount} plans
          </p>
        </div>

        <div className="flex flex-wrap items-stretch gap-5">
          {upNextPlan && <UpNextCard session={upNext} plan={upNextPlan} />}
          <AlsoToday sessions={alsoToday} redo={redoQueue} />
        </div>
      </section>

      <StatTiles stats={stats} />

      <WeekCalendar rangeLabel={week.rangeLabel} days={week.days} plans={plans} />

      <ActivePlans plans={plans} />
    </main>
  )
}