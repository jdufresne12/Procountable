import { Layers, LayoutDashboard } from "lucide-react"

export const mockUser = {
    timeZone: "America/New_York",
    streakDays: 12,
}

export const navTree: NavNode[] = [
    { title: "Dashboard", href: "/", icon: LayoutDashboard },
    {
        title: "Plans",
        href: "/your-plans",
        icon: Layers,
        children: [
            {
                title: "Coding interview refresh",
                href: "/your-plans/coding-interview-refresh",
                dotClass: "bg-brand/45",
                children: [
                    { title: "1. Arrays", href: "/your-plans/coding-interview-refresh/lesson/1", status: "done" },
                    { title: "2. Stacks & lists", href: "/your-plans/coding-interview-refresh/lesson/2", status: "done" },
                    { title: "3. Trees", href: "/your-plans/coding-interview-refresh/lesson/3", status: "current" },
                    { title: "4. Graphs", href: "/your-plans/coding-interview-refresh/lesson/4", status: "locked" },
                ],
            },
            {
                title: "System design",
                href: "/your-plans/system-design",
                dotClass: "bg-sun",
                children: [
                    { title: "1. Foundations", href: "/your-plans/system-design/lesson/1", status: "done" },
                    { title: "2. APIs and traffic", href: "/your-plans/system-design/lesson/2", status: "current" },
                    { title: "3. Data storage", href: "/your-plans/system-design/lesson/3", status: "locked" },
                ],
            },
            {
                title: "AWS for full stack",
                href: "/your-plans/aws-for-full-stack",
                dotClass: "bg-coral/60",
                children: [
                    { title: "1. Accounts and IAM", href: "/your-plans/aws-for-full-stack/lesson/1", status: "current" },
                    { title: "2. Networking basics", href: "/your-plans/aws-for-full-stack/lesson/2", status: "locked" },
                    { title: "3. Compute options", href: "/your-plans/aws-for-full-stack/lesson/3", status: "locked" },
                ],
            },
        ],
    },
]

export const plans: Plan[] = [
    {
        id: "coding-interview-refresh",
        name: "Coding interview refresh",
        color: "violet",
        progress: 38,
        currentSection: 3,
        totalSections: 8,
        status: "on-track",
        statusLabel: "On track",
        href: "/your-plans/coding-interview-refresh",
    },
    {
        id: "system-design",
        name: "System design",
        color: "sun",
        progress: 25,
        currentSection: 2,
        totalSections: 6,
        status: "behind",
        statusLabel: "2 days behind",
        href: "/your-plans/system-design",
    },
    {
        id: "aws-for-full-stack",
        name: "AWS for full stack",
        color: "coral",
        progress: 8,
        currentSection: 1,
        totalSections: 6,
        status: "on-track",
        statusLabel: "On track",
        href: "/your-plans/aws-for-full-stack",
    },
]

export const upNext: UpNext = {
    id: "session-trees",
    planId: "coding-interview-refresh",
    title: "Trees: traversal patterns",
    kind: "section",
    minutes: 45,
    minutesLeft: 35,
    sectionNumber: 3,
    href: "/your-plans/coding-interview-refresh/sections/3",
    steps: [
        { label: "Learn", state: "done" },
        { label: "Practice", state: "current" },
        { label: "Mastery check", state: "locked" },
    ],
}

export const alsoToday: Session[] = [
    {
        id: "session-rate-limiter",
        planId: "system-design",
        title: "Design a rate limiter",
        kind: "practice design",
        minutes: 45,
        href: "/your-plans/system-design/sections/2",
    },
    {
        id: "session-iam",
        planId: "aws-for-full-stack",
        title: "Accounts and IAM",
        kind: "lesson",
        minutes: 30,
        href: "/your-plans/aws-for-full-stack/sections/1",
    },
]

export const redoQueue = {
    dueToday: 2,
    minutes: 15,
    href: "/redo",
}

export const stats: Stat[] = [
    { value: "4", label: "In your redo queue", hint: "Across 2 plans", tone: "sun" },
    { value: "9", label: "Sessions left this week", hint: "1 plan is behind", tone: "coral" },
    { value: "2/3", label: "Mastery checks passed", hint: "1 passed with gaps", tone: "mint" },
]

export const week: { rangeLabel: string; days: CalendarDay[] } = {
    rangeLabel: "Nov 9 – 15",
    days: [
        {
            weekday: "Mon", day: 9, isToday: false, items: [
                { label: "Linked lists check", planId: "coding-interview-refresh", done: true },
                { label: "Plan created", planId: "aws-for-full-stack", done: true },
            ],
        },
        {
            weekday: "Tue", day: 10, isToday: false, items: [
                { label: "Trees: learn", planId: "coding-interview-refresh", done: true },
                { label: "URL shortener", planId: "system-design", done: true },
            ],
        },
        {
            weekday: "Wed", day: 11, isToday: true, items: [
                { label: "Trees: practice", planId: "coding-interview-refresh", done: false },
                { label: "Rate limiter", planId: "system-design", done: false },
                { label: "IAM basics", planId: "aws-for-full-stack", done: false },
            ],
        },
        {
            weekday: "Thu", day: 12, isToday: false, items: [
                { label: "Redo: 2 problems", planId: null, done: false },
                { label: "Trees: check", planId: "coding-interview-refresh", done: false },
            ],
        },
        {
            weekday: "Fri", day: 13, isToday: false, items: [
                { label: "Notifications", planId: "system-design", done: false },
                { label: "VPC basics", planId: "aws-for-full-stack", done: false },
            ],
        },
        {
            weekday: "Sat", day: 14, isToday: false, items: [
                { label: "Graphs: learn", planId: "coding-interview-refresh", done: false },
            ],
        },
        {
            weekday: "Sun", day: 15, isToday: false, items: [
                { label: "Weekly review", planId: null, done: false },
            ],
        },
    ],
}

export function getPlan(planId: string | null) {
    return plans.find((p) => p.id === planId)
}