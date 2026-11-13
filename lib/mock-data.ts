import { Layers, LayoutDashboard } from "lucide-react"

// =============================================================================
// Mock data. Everything the pages show is derived from `planRecords`, the same
// way it will later be derived from database rows. To go live, replace
// `planRecords` (and the dashboard-only exports at the bottom) with queries.
// =============================================================================

export const mockUser = {
    timeZone: "America/New_York",
    streakDays: 12,
}

// ---------------------------------------------------------------------------
// Small builders to keep the records readable
// ---------------------------------------------------------------------------

type SectionInput = Omit<PlanSection, "resources" | "quiz"> &
    Partial<Pick<PlanSection, "resources" | "quiz">>

const section = (s: SectionInput): PlanSection => ({ resources: [], quiz: [], ...s })

const rubricFrom = (objectives: string[], level: MasteryLevel = "strong"): RubricItem[] =>
    objectives.map((objective) => ({ objective, level, note: level === "strong" ? "Clear and confident" : "Solid answer" }))

const passed = (takenOn: string, objectives: string[]): MasteryResult => ({
    outcome: "pass",
    takenOn,
    rubric: rubricFrom(objectives),
})

// ---------------------------------------------------------------------------
// Plans
// ---------------------------------------------------------------------------

const codingObjectives = {
    arrays: ["Use a hash map to trade space for time", "Spot two-pointer and sliding-window problems", "State time and space complexity"],
    stacks: ["Use a stack for matching and 'next greater' problems", "Reverse and merge linked lists in place", "State time and space complexity"],
    trees: ["Choose DFS vs. BFS and explain why", "Write correct base cases", "Use the BST ordering property", "State time and space complexity"],
}

export const planRecords: PlanRecord[] = [
    {
        id: "coding-interview-refresh",
        name: "Coding interview refresh",
        color: "violet",
        lifecycle: "active",
        schedule: "on-track",
        goal: "Get fast and confident at data-structure and algorithm problems for software engineering interviews.",
        startDate: "2026-10-28",
        endDate: "2026-12-23",
        hoursPerWeek: 10,
        rules: { masteryCheck: true, reminderTime: "7:30 PM", allowSkipping: false },
        upcoming: [
            { date: "2026-11-12", label: "Trees: practice", minutes: 25 },
            { date: "2026-11-13", label: "Trees: mastery check", minutes: 10 },
            { date: "2026-11-15", label: "Graphs: learn", minutes: 40 },
        ],
        redo: [
            { prompt: "Reverse a linked list in groups of k", section: 2 },
            { prompt: "Min stack with O(1) getMin", section: 2 },
            { prompt: "Level order traversal (BFS by depth)", section: 3 },
        ],
        sections: [
            section({
                number: 1,
                title: "Arrays and hashing",
                summary: "Hash maps, two pointers and sliding windows: the patterns behind most array problems.",
                week: 1,
                minutes: 180,
                status: "done",
                objectives: codingObjectives.arrays,
                lesson: [
                    { type: "paragraph", text: "Most array problems ask you to find something faster than checking every pair. The usual trick is to remember what you've already seen, so each element is only looked at once." },
                    { type: "heading", text: "Hash maps" },
                    { type: "paragraph", text: "Store values (or their positions) as you go. Lookups are O(1), so a nested O(n²) loop becomes a single O(n) pass." },
                    { type: "code", language: "python", code: "def two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target - n], i]\n        seen[n] = i" },
                    { type: "tip", title: "Interview tip", text: "Say the brute-force idea and its complexity first, then improve it. It shows you can reason about trade-offs." },
                ],
                resources: [
                    { kind: "practice", title: "Two Sum (LC 1)", meta: "Easy · LeetCode", url: "https://leetcode.com/problems/two-sum/" },
                    { kind: "practice", title: "Longest Substring Without Repeating Characters (LC 3)", meta: "Medium · LeetCode", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
                ],
                quiz: [
                    {
                        id: "a1",
                        concept: "Hash maps",
                        prompt: "What does a hash map usually trade to bring an O(n²) pair search down to O(n)?",
                        options: [
                            { id: "a", text: "Extra memory" },
                            { id: "b", text: "Sorting the input first" },
                            { id: "c", text: "Recursion depth" },
                            { id: "d", text: "Nothing, it's free" },
                        ],
                        answerId: "a",
                        explanation: "You store what you've seen, which costs O(n) extra space but makes each lookup O(1).",
                    },
                ],
                mastery: passed("2026-11-02", codingObjectives.arrays),
            }),
            section({
                number: 2,
                title: "Stacks and linked lists",
                summary: "Stack patterns for matching and 'next greater', plus in-place linked list surgery.",
                week: 2,
                minutes: 180,
                status: "done",
                objectives: codingObjectives.stacks,
                mastery: {
                    outcome: "pass-with-gaps",
                    takenOn: "2026-11-09",
                    rubric: [
                        { objective: codingObjectives.stacks[0], level: "strong", note: "Explained the monotonic stack clearly" },
                        { objective: codingObjectives.stacks[1], level: "gap", note: "Lost track of pointers when reversing in groups" },
                        { objective: codingObjectives.stacks[2], level: "solid", note: "Correct after one prompt" },
                    ],
                },
            }),
            section({
                number: 3,
                title: "Trees",
                summary: "Depth-first and breadth-first traversal, and how to pick the right one.",
                week: 3,
                minutes: 180,
                status: "current",
                currentStep: "practice",
                objectives: codingObjectives.trees,
                lesson: [
                    { type: "paragraph", text: "Almost every tree problem is a traversal with a small job done at each node. Pick the traversal first, then decide what each node hands back to its parent." },
                    { type: "heading", text: "Depth-first search" },
                    { type: "paragraph", text: "Recursion follows one branch all the way down before backing up. Reach for it when a node's answer depends on its children's answers: height, validity, path sums." },
                    { type: "code", language: "python", code: "def max_depth(node):\n    if node is None:\n        return 0\n    left = max_depth(node.left)\n    right = max_depth(node.right)\n    return 1 + max(left, right)" },
                    { type: "heading", text: "Breadth-first search" },
                    { type: "paragraph", text: "A queue visits the tree one level at a time. Reach for it when the question mentions levels, the nearest node, or what you'd see from one side." },
                    { type: "tip", title: "Interview tip", text: "Say which traversal you're using and why before you write any code. It shows your plan and catches a wrong choice early." },
                ],
                resources: [
                    { kind: "article", title: "Tree traversal", meta: "Wikipedia · 10 min read", url: "https://en.wikipedia.org/wiki/Tree_traversal" },
                    { kind: "practice", title: "Invert Binary Tree (LC 226)", meta: "Easy · LeetCode", url: "https://leetcode.com/problems/invert-binary-tree/" },
                    { kind: "practice", title: "Binary Tree Level Order Traversal (LC 102)", meta: "Medium · LeetCode", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
                    { kind: "practice", title: "Validate Binary Search Tree (LC 98)", meta: "Medium · LeetCode", url: "https://leetcode.com/problems/validate-binary-search-tree/" },
                ],
                quiz: [
                    {
                        id: "t1",
                        concept: "BFS",
                        prompt: "You need every node's value grouped by depth. Which data structure should drive the traversal?",
                        options: [
                            { id: "a", text: "Stack" },
                            { id: "b", text: "Queue" },
                            { id: "c", text: "Min-heap" },
                            { id: "d", text: "Hash map" },
                        ],
                        answerId: "b",
                        explanation: "A queue returns nodes in the order you found them, so you finish one level before starting the next.",
                    },
                    {
                        id: "t2",
                        concept: "Complexity",
                        prompt: "What's the extra space used by recursive DFS on a balanced binary tree with n nodes?",
                        options: [
                            { id: "a", text: "O(1)" },
                            { id: "b", text: "O(log n)" },
                            { id: "c", text: "O(n)" },
                            { id: "d", text: "O(n log n)" },
                        ],
                        answerId: "b",
                        explanation: "Only one root-to-leaf path is on the call stack at a time. That's the tree's height, which is O(log n) when balanced.",
                    },
                    {
                        id: "t3",
                        concept: "BST",
                        prompt: "Which traversal of a binary search tree visits the values in sorted order?",
                        options: [
                            { id: "a", text: "Pre-order" },
                            { id: "b", text: "In-order" },
                            { id: "c", text: "Post-order" },
                            { id: "d", text: "Level order" },
                        ],
                        answerId: "b",
                        explanation: "In-order visits left subtree, node, right subtree. With the BST property, that's ascending order.",
                    },
                    {
                        id: "t4",
                        concept: "DFS",
                        prompt: "A node's answer depends on its children's answers (like height). Which traversal fits?",
                        options: [
                            { id: "a", text: "Pre-order DFS" },
                            { id: "b", text: "Post-order DFS" },
                            { id: "c", text: "BFS" },
                            { id: "d", text: "Any of them" },
                        ],
                        answerId: "b",
                        explanation: "Post-order handles the children first, so their results are ready when you compute the parent's.",
                    },
                ],
            }),
            section({ number: 4, title: "Graphs", summary: "BFS and DFS on grids and adjacency lists, cycle detection and topological sort.", week: 4, minutes: 200, status: "locked", objectives: ["Build an adjacency list from edges", "Detect cycles", "Order tasks with topological sort"] }),
            section({ number: 5, title: "Heaps and priority queues", summary: "Top-k, merging sorted lists and scheduling with a heap.", week: 5, minutes: 160, status: "locked", objectives: ["Know when a heap beats sorting", "Solve top-k problems", "State heap operation costs"] }),
            section({ number: 6, title: "Backtracking", summary: "Subsets, permutations and pruning a search tree.", week: 6, minutes: 180, status: "locked", objectives: ["Write the choose / explore / un-choose template", "Prune branches early", "Estimate search-space size"] }),
            section({ number: 7, title: "Dynamic programming", summary: "Turning recursion with repeated work into memoized and bottom-up solutions.", week: 7, minutes: 240, status: "locked", objectives: ["Define the state and the recurrence", "Go from memoization to a table", "Reduce space where possible"] }),
            section({ number: 8, title: "Timed problem sets", summary: "Mixed problems under interview time limits, with feedback after each.", week: 8, minutes: 300, status: "locked", objectives: ["Pick a pattern within 5 minutes", "Finish medium problems in 25 minutes", "Talk through your solution out loud"] }),
        ],
    },

    {
        id: "system-design",
        name: "System design",
        color: "sun",
        lifecycle: "active",
        schedule: "behind",
        daysBehind: 2,
        goal: "Design and explain scalable systems clearly in a 45-minute interview.",
        startDate: "2026-10-28",
        endDate: "2026-12-09",
        hoursPerWeek: 5,
        rules: { masteryCheck: true, reminderTime: "7:30 PM", allowSkipping: false },
        upcoming: [
            { date: "2026-11-12", label: "APIs and traffic: learn", minutes: 45 },
            { date: "2026-11-13", label: "Design a rate limiter", minutes: 45 },
            { date: "2026-11-16", label: "APIs and traffic: check", minutes: 10 },
        ],
        redo: [{ prompt: "Estimate storage for a URL shortener", section: 1 }],
        sections: [
            section({
                number: 1,
                title: "Foundations",
                summary: "Requirements, back-of-the-envelope estimates and the interview structure.",
                week: 1,
                minutes: 150,
                status: "done",
                objectives: ["Turn a vague prompt into requirements", "Estimate traffic and storage", "Follow a clear interview structure"],
                mastery: passed("2026-11-04", ["Turn a vague prompt into requirements", "Estimate traffic and storage", "Follow a clear interview structure"]),
            }),
            section({
                number: 2,
                title: "APIs and traffic",
                summary: "Designing APIs, load balancing and protecting services with rate limits.",
                week: 2,
                minutes: 150,
                status: "current",
                currentStep: "learn",
                objectives: ["Design a clean REST API", "Explain load balancing strategies", "Pick a rate-limiting algorithm"],
                lesson: [
                    { type: "paragraph", text: "Every design starts at the edge: how clients talk to your system and how you keep one noisy client from taking it down." },
                    { type: "heading", text: "Rate limiting" },
                    { type: "paragraph", text: "A token bucket refills at a steady rate and lets clients spend saved-up tokens in short bursts. A fixed window is simpler but lets traffic spike at window edges." },
                    { type: "tip", title: "Interview tip", text: "Say where the limiter lives (gateway vs. service) and what happens when it's exceeded (HTTP 429 with a Retry-After header)." },
                ],
                resources: [
                    { kind: "article", title: "Rate limiting", meta: "Wikipedia · 6 min read", url: "https://en.wikipedia.org/wiki/Rate_limiting" },
                    { kind: "docs", title: "429 Too Many Requests", meta: "MDN · reference", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429" },
                ],
                quiz: [
                    {
                        id: "s1",
                        concept: "Rate limiting",
                        prompt: "Which algorithm allows short bursts while still enforcing an average rate?",
                        options: [
                            { id: "a", text: "Fixed window counter" },
                            { id: "b", text: "Token bucket" },
                            { id: "c", text: "Round robin" },
                            { id: "d", text: "Consistent hashing" },
                        ],
                        answerId: "b",
                        explanation: "Tokens build up while a client is quiet, so it can burst, but refill is capped at the average rate.",
                    },
                    {
                        id: "s2",
                        concept: "APIs",
                        prompt: "What is an idempotency key for?",
                        options: [
                            { id: "a", text: "Encrypting request bodies" },
                            { id: "b", text: "Letting clients safely retry a request without it running twice" },
                            { id: "c", text: "Picking which server handles a request" },
                            { id: "d", text: "Versioning an API" },
                        ],
                        answerId: "b",
                        explanation: "The server remembers the key and returns the original result on a retry, so a payment isn't charged twice.",
                    },
                ],
            }),
            section({ number: 3, title: "Data storage", summary: "SQL vs. NoSQL, indexing, replication and sharding.", week: 3, minutes: 150, status: "locked", objectives: ["Choose a database for a workload", "Explain replication and sharding", "Design indexes for key queries"] }),
            section({ number: 4, title: "Caching", summary: "Where to cache, eviction policies and keeping caches consistent.", week: 4, minutes: 150, status: "locked", objectives: ["Place caches in the request path", "Compare eviction policies", "Handle cache invalidation"] }),
            section({ number: 5, title: "Queues and events", summary: "Async work, message queues and event-driven designs.", week: 5, minutes: 150, status: "locked", objectives: ["Decide when to go async", "Explain delivery guarantees", "Design a retry strategy"] }),
            section({ number: 6, title: "Case studies", summary: "Full mock designs: URL shortener, chat, news feed.", week: 6, minutes: 200, status: "locked", objectives: ["Run a full 45-minute design", "Defend trade-offs under questions", "Manage time across the interview"] }),
        ],
    },

    {
        id: "aws-for-full-stack",
        name: "AWS for full stack",
        color: "coral",
        lifecycle: "active",
        schedule: "on-track",
        goal: "Deploy and run a full stack app on AWS, and be ready to explain every piece in an interview.",
        startDate: "2026-11-09",
        endDate: "2026-12-07",
        hoursPerWeek: 8,
        rules: { masteryCheck: true, reminderTime: "7:30 PM", allowSkipping: true },
        upcoming: [
            { date: "2026-11-12", label: "Accounts and IAM: learn", minutes: 30 },
            { date: "2026-11-13", label: "Accounts and IAM: practice", minutes: 20 },
            { date: "2026-11-14", label: "Networking basics: learn", minutes: 40 },
        ],
        redo: [],
        sections: [
            section({
                number: 1,
                title: "Accounts and IAM",
                summary: "Users, roles and policies, and how to follow least privilege.",
                week: 1,
                minutes: 120,
                status: "current",
                currentStep: "learn",
                objectives: ["Explain users, groups, roles and policies", "Write a least-privilege policy", "Secure the root account"],
                lesson: [
                    { type: "paragraph", text: "IAM decides who can do what in your AWS account. Every request is checked against policies attached to the user or role making it." },
                    { type: "heading", text: "Roles over keys" },
                    { type: "paragraph", text: "Apps running on AWS should use a role, not long-lived access keys. The service gets short-lived credentials automatically." },
                    { type: "code", language: "json", code: "{\n  \"Version\": \"2012-10-17\",\n  \"Statement\": [{\n    \"Effect\": \"Allow\",\n    \"Action\": [\"s3:GetObject\"],\n    \"Resource\": \"arn:aws:s3:::my-app-uploads/*\"\n  }]\n}" },
                    { type: "tip", title: "Interview tip", text: "Mention least privilege and MFA on the root user unprompted. Interviewers listen for it." },
                ],
                resources: [
                    { kind: "docs", title: "What is IAM?", meta: "AWS docs", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html" },
                    { kind: "docs", title: "Security best practices in IAM", meta: "AWS docs", url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html" },
                ],
                quiz: [
                    {
                        id: "i1",
                        concept: "Roles",
                        prompt: "Your app on EC2 needs to read from S3. What's the right way to give it access?",
                        options: [
                            { id: "a", text: "Put an access key in an environment variable" },
                            { id: "b", text: "Attach an IAM role to the instance" },
                            { id: "c", text: "Make the bucket public" },
                            { id: "d", text: "Use the root user's credentials" },
                        ],
                        answerId: "b",
                        explanation: "A role gives the instance short-lived credentials that rotate automatically, with no secrets to leak.",
                    },
                    {
                        id: "i2",
                        concept: "Least privilege",
                        prompt: "What does 'least privilege' mean?",
                        options: [
                            { id: "a", text: "Only admins can create users" },
                            { id: "b", text: "Grant only the permissions a task actually needs" },
                            { id: "c", text: "Deny everything by default and never allow" },
                            { id: "d", text: "Give new users read-only access to everything" },
                        ],
                        answerId: "b",
                        explanation: "Each user or role should have exactly the permissions its job needs, which limits the damage if it's misused.",
                    },
                ],
            }),
            section({ number: 2, title: "Networking basics", summary: "VPCs, subnets, route tables and security groups.", week: 1, minutes: 120, status: "locked", objectives: ["Lay out public and private subnets", "Configure security groups", "Explain NAT and internet gateways"] }),
            section({ number: 3, title: "Compute options", summary: "EC2 vs. ECS Fargate vs. Lambda, and when to use each.", week: 2, minutes: 120, status: "locked", objectives: ["Compare compute options", "Pick one for a given workload", "Estimate rough costs"] }),
            section({ number: 4, title: "Storage and databases", summary: "S3, RDS, backups and connection pooling.", week: 2, minutes: 120, status: "locked", objectives: ["Store uploads in S3 safely", "Run Postgres on RDS", "Plan backups and restores"] }),
            section({ number: 5, title: "Deploy a full stack app", summary: "Project: ship your app with a CI/CD pipeline.", week: 3, minutes: 240, status: "locked", objectives: ["Deploy a Next.js app end to end", "Set up a CI/CD pipeline", "Manage secrets safely"] }),
            section({ number: 6, title: "Monitoring and cost", summary: "CloudWatch, alarms and keeping the bill low.", week: 4, minutes: 120, status: "locked", objectives: ["Set up logs and alarms", "Read a cost breakdown", "Cut obvious waste"] }),
        ],
    },

    {
        id: "spanish-for-travel",
        name: "Spanish for travel",
        color: "coral",
        lifecycle: "paused",
        schedule: "on-track",
        goal: "Handle everyday travel situations in Spanish: directions, food, hotels and small talk.",
        startDate: "2026-10-05",
        endDate: "2026-11-16",
        hoursPerWeek: 3,
        pausedOn: "2026-10-20",
        rules: { masteryCheck: true, reminderTime: null, allowSkipping: true },
        upcoming: [],
        redo: [
            { prompt: "Ask for directions to the train station", section: 1 },
            { prompt: "Numbers 20–100", section: 1 },
        ],
        sections: [
            section({ number: 1, title: "Greetings and basics", summary: "Introductions, numbers and polite phrases.", week: 1, minutes: 90, status: "done", objectives: ["Introduce yourself", "Use numbers and prices", "Use polite forms"], mastery: passed("2026-10-12", ["Introduce yourself", "Use numbers and prices", "Use polite forms"]) }),
            section({ number: 2, title: "Getting around", summary: "Directions, transport and buying tickets.", week: 2, minutes: 90, status: "current", currentStep: "learn", objectives: ["Ask for and follow directions", "Buy a ticket"] }),
            section({ number: 3, title: "Food and ordering", summary: "Menus, ordering and paying.", week: 3, minutes: 90, status: "locked", objectives: ["Read a menu", "Order and ask for the bill"] }),
            section({ number: 4, title: "Hotels", summary: "Checking in and solving problems.", week: 4, minutes: 90, status: "locked", objectives: ["Check in", "Report a problem"] }),
            section({ number: 5, title: "Emergencies", summary: "Pharmacies, doctors and asking for help.", week: 5, minutes: 90, status: "locked", objectives: ["Describe a problem", "Ask for help"] }),
            section({ number: 6, title: "Small talk", summary: "Chatting about plans, weather and where you're from.", week: 6, minutes: 90, status: "locked", objectives: ["Hold a short conversation"] }),
        ],
    },

    {
        id: "typescript-fundamentals",
        name: "TypeScript fundamentals",
        color: "violet",
        lifecycle: "completed",
        schedule: "on-track",
        goal: "Write type-safe React and Node code without fighting the compiler.",
        startDate: "2026-09-11",
        endDate: "2026-10-02",
        completedOn: "2026-10-02",
        hoursPerWeek: 6,
        rules: { masteryCheck: true, reminderTime: "8:00 PM", allowSkipping: false },
        upcoming: [],
        redo: [],
        sections: [
            ["Types and inference", "Primitive, object and union types, and letting inference do the work."],
            ["Narrowing", "typeof, in, discriminated unions and type guards."],
            ["Generics", "Reusable functions and components with type parameters."],
            ["Utility types", "Partial, Pick, Omit, Record and friends."],
            ["Typing React", "Props, events, refs and hooks."],
        ].map(([title, summary], i) =>
            section({
                number: i + 1,
                title,
                summary,
                week: Math.floor(i / 2) + 1,
                minutes: 120,
                status: "done",
                objectives: [`Explain ${title.toLowerCase()}`, `Apply ${title.toLowerCase()} in real code`],
                mastery: passed(`2026-09-${String(14 + i * 4).padStart(2, "0")}`, [`Explain ${title.toLowerCase()}`, `Apply ${title.toLowerCase()} in real code`]),
            }),
        ),
    },

    {
        id: "react-performance",
        name: "React performance",
        color: "sun",
        lifecycle: "completed",
        schedule: "on-track",
        goal: "Find and fix slow renders in real React apps.",
        startDate: "2026-08-24",
        endDate: "2026-09-14",
        completedOn: "2026-09-14",
        hoursPerWeek: 4,
        rules: { masteryCheck: true, reminderTime: null, allowSkipping: false },
        upcoming: [],
        redo: [{ prompt: "When does useMemo not help?", section: 2 }],
        sections: [
            section({ number: 1, title: "Rendering model", summary: "What triggers a render and how React reconciles.", week: 1, minutes: 90, status: "done", objectives: ["Explain what triggers a render"], mastery: passed("2026-08-27", ["Explain what triggers a render"]) }),
            section({
                number: 2,
                title: "Memoization",
                summary: "memo, useMemo and useCallback, and when they're worth it.",
                week: 1,
                minutes: 90,
                status: "done",
                objectives: ["Know when memoization helps", "Avoid unstable props"],
                mastery: {
                    outcome: "pass-with-gaps",
                    takenOn: "2026-09-01",
                    rubric: [
                        { objective: "Know when memoization helps", level: "gap", note: "Reached for useMemo on cheap calculations" },
                        { objective: "Avoid unstable props", level: "solid", note: "Correct with a hint" },
                    ],
                },
            }),
            section({ number: 3, title: "Lists and virtualization", summary: "Keys, long lists and windowing.", week: 2, minutes: 90, status: "done", objectives: ["Render long lists efficiently"], mastery: passed("2026-09-07", ["Render long lists efficiently"]) }),
            section({ number: 4, title: "Profiling", summary: "Using the React Profiler to find the real bottleneck.", week: 3, minutes: 90, status: "done", objectives: ["Read a profiler flame graph"], mastery: passed("2026-09-14", ["Read a profiler flame graph"]) }),
        ],
    },
]

// ---------------------------------------------------------------------------
// Derived helpers: these are what pages call. Keep using them when real data lands.
// ---------------------------------------------------------------------------

export const planHref = (planId: string) => `/your-plans/${planId}`
export const lessonHref = (planId: string, sectionNumber: number) => `/your-plans/${planId}/lesson/${sectionNumber}`

const stepOrder: LessonStep[] = ["learn", "practice", "check"]
const stepLabels: Record<LessonStep, string> = { learn: "Learn", practice: "Practice", check: "Mastery check" }

export function getSectionSteps(s: PlanSection): { step: LessonStep; label: string; state: StepState }[] {
    const currentIndex = stepOrder.indexOf(s.currentStep ?? "learn")
    return stepOrder.map((step, i) => {
        let state: StepState
        if (s.status === "done") state = "done"
        else if (s.status === "locked") state = "locked"
        else state = i < currentIndex ? "done" : i === currentIndex ? "current" : "locked"
        return { step, label: stepLabels[step], state }
    })
}

export const getCurrentSection = (r: PlanRecord) => r.sections.find((s) => s.status === "current")

export function getPlanProgress(r: PlanRecord) {
    const done = r.sections.filter((s) => s.status === "done").length
    const current = getCurrentSection(r)
    const partial = current ? stepOrder.indexOf(current.currentStep ?? "learn") / stepOrder.length : 0
    return Math.round(((done + partial) / r.sections.length) * 100)
}

export function getStatusLabel(r: PlanRecord) {
    if (r.lifecycle === "completed") return "Completed"
    if (r.lifecycle === "paused") return "Paused"
    if (r.schedule === "behind") return `${r.daysBehind ?? 1} day${r.daysBehind === 1 ? "" : "s"} behind`
    return "On track"
}

function toPlan(r: PlanRecord): Plan {
    const current = getCurrentSection(r)
    return {
        id: r.id,
        name: r.name,
        color: r.color,
        lifecycle: r.lifecycle,
        progress: getPlanProgress(r),
        currentSection: current?.number ?? r.sections.length,
        totalSections: r.sections.length,
        status: r.schedule,
        statusLabel: getStatusLabel(r),
        href: planHref(r.id),
    }
}

export const allPlans: Plan[] = planRecords.map(toPlan)
export const plans: Plan[] = allPlans.filter((p) => p.lifecycle === "active")

export const getPlan = (planId: string | null) => allPlans.find((p) => p.id === planId)
export const getPlanRecord = (planId: string) => planRecords.find((r) => r.id === planId)
export const getSection = (planId: string, sectionNumber: number) =>
    getPlanRecord(planId)?.sections.find((s) => s.number === sectionNumber)

// Sidebar tree, built from active plans
const dotClasses: Record<PlanColor, string> = { violet: "bg-brand/45", sun: "bg-sun", coral: "bg-coral/60" }

export const navTree: NavNode[] = [
    { title: "Dashboard", href: "/", icon: LayoutDashboard },
    {
        title: "Plans",
        href: "/your-plans",
        icon: Layers,
        children: planRecords
            .filter((r) => r.lifecycle === "active")
            .map((r) => ({
                title: r.name,
                href: planHref(r.id),
                dotClass: dotClasses[r.color],
                children: r.sections.map((s) => ({
                    title: `${s.number}. ${s.title}`,
                    href: lessonHref(r.id, s.number),
                    status: s.status,
                })),
            })),
    },
]

// ---------------------------------------------------------------------------
// New plan page: a mock intake conversation and the draft it produced
// ---------------------------------------------------------------------------

export const newPlanDraft: PlanDraft = {
    name: "Docker for full stack apps",
    goal: "Containerize a Next.js + Postgres app, run it locally with Compose, and explain the setup in interviews.",
    weeks: 2,
    hoursPerWeek: 6,
    endDate: "2026-11-27",
    sections: [
        { title: "Containers and images", summary: "What a container is, images, layers and the Docker CLI", week: 1 },
        { title: "Writing a Dockerfile", summary: "Multi-stage builds for a Next.js app", week: 1 },
        { title: "Compose for local dev", summary: "App + Postgres with volumes and env files", week: 1 },
        { title: "Networking and volumes", summary: "How containers talk and keep data", week: 2 },
        { title: "Ship it", summary: "Project: push an image and run it in the cloud", week: 2 },
    ],
    suggestions: ["Make it 1 week", "Add Kubernetes basics", "More hands-on projects"],
    messages: [
        { from: "ai", text: "Tell me what you want to learn and why. I'll ask a few questions, then draft a plan you can edit." },
        { from: "you", text: "I want to learn Docker well enough to containerize my Next.js apps." },
        { from: "ai", text: "Good goal. Have you used Docker before, and what would 'well enough' look like for you?" },
        { from: "you", text: "I've run other people's containers but never written a Dockerfile. I want to run my app and Postgres locally with one command." },
        { from: "ai", text: "How many hours a week can you give this, and is there a date you're aiming for?" },
        { from: "you", text: "About 6 hours a week, and I'd like it done before Thanksgiving." },
        { from: "ai", text: "That fits in 2 weeks. I drafted 5 sections on the right, ending with a deployed image. Change anything before you commit." },
    ],
}

// ---------------------------------------------------------------------------
// Dashboard-only mock data (unchanged shape)
// ---------------------------------------------------------------------------

export const upNext: UpNext = {
    id: "session-trees",
    planId: "coding-interview-refresh",
    title: "Trees: traversal patterns",
    kind: "section",
    minutes: 45,
    minutesLeft: 35,
    sectionNumber: 3,
    href: lessonHref("coding-interview-refresh", 3),
    steps: getSectionSteps(getSection("coding-interview-refresh", 3)!).map(({ label, state }) => ({ label, state })),
}

export const alsoToday: Session[] = [
    {
        id: "session-rate-limiter",
        planId: "system-design",
        title: "Design a rate limiter",
        kind: "practice design",
        minutes: 45,
        href: lessonHref("system-design", 2),
    },
    {
        id: "session-iam",
        planId: "aws-for-full-stack",
        title: "Accounts and IAM",
        kind: "lesson",
        minutes: 30,
        href: lessonHref("aws-for-full-stack", 1),
    },
]

export const redoQueue = {
    dueToday: 2,
    minutes: 15,
    href: planHref("coding-interview-refresh"),
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
