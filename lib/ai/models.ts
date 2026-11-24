export const models = {
    testing: "recursive/flint-v1.0",        // Testing
    planner: "anthropic/claude-sonnet-5.5", // intake + outline
    writer: "anthropic/claude-sonnet-5.5",  // lessons
    fast: "anthropic/claude-haiku-5.5",     // quizzes, picking resources
} as const