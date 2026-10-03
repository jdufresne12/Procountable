import type { Roadmap, Status, Task } from "../types"

// Mock data only. Replace with your real data source when you wire things up.

let n = 0
function task(
    title: string,
    week: number,
    extra: Partial<Omit<Task, "id" | "title" | "week">> = {},
): Task {
    n += 1
    return {
        id: `task-${n}`,
        title,
        week,
        status: "not-started" as Status,
        notes: "",
        links: [],
        ...extra,
    }
}

const lc = (slug: string) => ({
    label: "Problem on LeetCode",
    url: `https://leetcode.com/problems/${slug}/`,
})

export const mockRoadmaps: Roadmap[] = [
    {
        id: "coding-review",
        title: "Coding Review",
        tracks: [
            {
                id: "algorithms",
                title: "Algorithms",
                modules: [
                    {
                        id: "arrays-hashing",
                        title: "Arrays and hashing",
                        tasks: [
                            task("Two Sum", 1, { ref: "LC 1", status: "done", links: [lc("two-sum")] }),
                            task("Contains Duplicate", 1, { ref: "LC 217", status: "done", links: [lc("contains-duplicate")] }),
                            task("Group Anagrams", 1, {
                                ref: "LC 49",
                                status: "in-progress",
                                notes:
                                    "Key idea: use the sorted string (or a 26-letter count) as the hash map key.\n\nFirst try sorted each word, O(n * k log k). Redo with the count key in two days.",
                                links: [lc("group-anagrams"), { label: "Video walkthrough", url: "https://neetcode.io/" }],
                            }),
                        ],
                    },
                    {
                        id: "sliding-window",
                        title: "Sliding window",
                        tasks: [
                            task("Best Time to Buy and Sell Stock", 1, { ref: "LC 121", links: [lc("best-time-to-buy-and-sell-stock")] }),
                            task("Longest Substring Without Repeating Characters", 1, {
                                ref: "LC 3",
                                links: [lc("longest-substring-without-repeating-characters")],
                            }),
                        ],
                    },
                    {
                        id: "two-pointers",
                        title: "Two pointers",
                        tasks: [
                            task("Valid Palindrome", 1, { ref: "LC 125", links: [lc("valid-palindrome")] }),
                            task("3Sum", 2, { ref: "LC 15", links: [lc("3sum")] }),
                        ],
                    },
                ],
            },
            {
                id: "system-design",
                title: "System design",
                modules: [
                    {
                        id: "fundamentals",
                        title: "Fundamentals",
                        tasks: [
                            task("Scaling and load balancing", 1),
                            task("Caching strategies", 1),
                            task("SQL vs. NoSQL", 1),
                        ],
                    },
                    {
                        id: "practice-designs",
                        title: "Practice designs",
                        tasks: [task("Design a URL shortener", 3)],
                    },
                ],
            },
            {
                id: "mini-projects",
                title: "Mini projects",
                modules: [
                    {
                        id: "builds",
                        title: "Weekly builds",
                        tasks: [
                            task("LRU cache library with tests", 1),
                            task("Rate limiter middleware (token bucket)", 2),
                            task("URL shortener with Postgres and Redis", 3),
                        ],
                    },
                ],
            },
            {
                id: "devops",
                title: "DevOps",
                modules: [
                    {
                        id: "pipelines",
                        title: "Pipelines and infrastructure",
                        tasks: [
                            task("GitHub Actions deploy pipeline", 4),
                            task("Terraform for the week 3 app", 4),
                        ],
                    },
                ],
            },
        ],
    },
    {
        // Empty on purpose so you can see the empty states.
        id: "kubernetes-basics",
        title: "Kubernetes Basics",
        tracks: [],
    },
]
