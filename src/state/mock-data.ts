/**
 * Mock data for TUI development — no file loading or orchestrator integration yet.
 */

import type { RalphLoop } from "../types/loop.js";
import type { SessionSummary } from "../types/session.js";

export const MOCK_SPEC_CONTENT = `# Feature: User Authentication

## Overview
Implement a complete user authentication system with login, registration,
and session management.

## Requirements
- Email/password registration with validation
- Secure password hashing (bcrypt)
- JWT-based session tokens
- Login/logout endpoints
- Protected route middleware
- Rate limiting on auth endpoints

## Acceptance Criteria
1. Users can register with email + password
2. Passwords are hashed before storage
3. Login returns a JWT valid for 24 hours
4. Protected routes reject expired/invalid tokens
5. Rate limiter blocks after 5 failed attempts per 15 minutes
`;

export const MOCK_PROMPT_CONTENT = `You are implementing a feature based on the following specification.

## Spec
{{spec}}

## Plan
{{plan}}

## Backpressure
{{backpressure}}

## Instructions
- Work on one task at a time
- Run tests after each change
- Commit after completing each task
- Current iteration: {{iteration}}
- Remaining budget: \${{remainingBudgetUsd}}
`;

export const MOCK_BP_CONTENT = `# Backpressure Checks

## TypeScript Type Check
\`\`\`
tsc --noEmit
\`\`\`
Runs after each iteration. Must pass before moving to next task.

## Test Suite
\`\`\`
npm test
\`\`\`
Runs after each task completion. All tests must pass.

## Linter
\`\`\`
eslint . --max-warnings 0
\`\`\`
Runs pre-commit. Zero warnings allowed.
`;

export const MOCK_LOOP: RalphLoop = {
  id: "loop-001",
  name: "auth-feature",
  targetDir: "/home/user/projects/my-app",
  plan: {
    filePath: "/home/user/projects/my-app/.wiggum/PLAN.md",
    specRef: "../SPEC.md",
    tasks: [
      {
        id: "task-1",
        title: "Set up auth database schema",
        description:
          "Create users table with email, password_hash, created_at, updated_at columns. Add unique index on email.",
        status: "completed",
        priority: 1,
        dependencies: [],
      },
      {
        id: "task-2",
        title: "Implement password hashing utils",
        description:
          "Create utility functions for hashing passwords with bcrypt and comparing hashes.",
        status: "completed",
        priority: 2,
        dependencies: ["task-1"],
      },
      {
        id: "task-3",
        title: "Build registration endpoint",
        description:
          "POST /api/auth/register — validate input, hash password, insert user, return JWT.",
        status: "in_progress",
        priority: 3,
        dependencies: ["task-2"],
      },
      {
        id: "task-4",
        title: "Build login endpoint",
        description:
          "POST /api/auth/login — validate credentials, return JWT on success.",
        status: "pending",
        priority: 4,
        dependencies: ["task-2"],
      },
      {
        id: "task-5",
        title: "Add auth middleware + protected routes",
        description:
          "Create JWT verification middleware. Apply to protected routes. Add rate limiting.",
        status: "pending",
        priority: 5,
        dependencies: ["task-3", "task-4"],
      },
    ],
  },
  spec: {
    filePath: "/home/user/projects/my-app/SPEC.md",
    content: MOCK_SPEC_CONTENT,
  },
  prompt: {
    filePath: "/home/user/projects/my-app/.wiggum/PROMPT.md",
    template: MOCK_PROMPT_CONTENT,
  },
  loop: {
    mode: "bounded",
    maxIterations: 10,
    budgetUsd: 5.0,
    model: "claude-sonnet-4-20250514",
  },
  backpressure: {
    checks: [
      { name: "TypeScript", command: "tsc --noEmit", trigger: "each_iteration" },
      { name: "Tests", command: "npm test", trigger: "each_task" },
      { name: "Linter", command: "eslint . --max-warnings 0", trigger: "pre_commit" },
    ],
    filePath: "/home/user/projects/my-app/.wiggum/BACKPRESSURE.md",
  },
  status: "running",
  createdAt: "2026-02-23T10:00:00Z",
  updatedAt: "2026-02-23T10:45:00Z",
};

export const MOCK_SESSIONS: SessionSummary[] = [
  {
    id: "sess-001",
    iteration: 1,
    status: "completed",
    taskTitle: "Set up auth database schema",
    costUsd: 0.42,
    numTurns: 8,
    durationMs: 120_000,
  },
  {
    id: "sess-002",
    iteration: 2,
    status: "completed",
    taskTitle: "Implement password hashing utils",
    costUsd: 0.31,
    numTurns: 6,
    durationMs: 95_000,
  },
  {
    id: "sess-003",
    iteration: 3,
    status: "running",
    taskTitle: "Build registration endpoint",
    costUsd: 0.28,
    numTurns: 5,
    durationMs: 78_000,
  },
  {
    id: "sess-004",
    iteration: 4,
    status: "failed",
    taskTitle: "Build registration endpoint",
    costUsd: 0.15,
    numTurns: 3,
    durationMs: 45_000,
  },
];

/** Mock document contents indexed by doc type. */
export const MOCK_DOC_CONTENT: Record<string, string> = {
  spec: MOCK_SPEC_CONTENT,
  prompt: MOCK_PROMPT_CONTENT,
  backpressure: MOCK_BP_CONTENT,
};
