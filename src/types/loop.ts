/**
 * Core domain types for a Ralph Wiggum loop.
 *
 * A Ralph loop is an autonomous coding session where Claude Code is run
 * repeatedly in headless mode to implement a plan. The plan references a
 * spec so the model understands the broader context of what it is building.
 */

// ---------------------------------------------------------------------------
// Spec
// ---------------------------------------------------------------------------

/**
 * The requirements document: PRD + how the feature fits into the existing
 * system. A spec is a standalone artifact that can be referenced by
 * multiple plans (across different loops).
 */
export interface Spec {
  /** Absolute path to the spec markdown file. */
  filePath: string;
  /** Raw markdown content (loaded from filePath). */
  content: string;
}

// ---------------------------------------------------------------------------
// Implementation Plan
// ---------------------------------------------------------------------------

export type TaskStatus = "pending" | "in_progress" | "completed" | "skipped";

/** A single atomic unit of work in the implementation plan. */
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  /** Explicit ordering hint — the agent may choose to work out of order. */
  priority: number;
  /** IDs of tasks that must be completed first. */
  dependencies: string[];
}

/**
 * The implementation plan: the diff between the desired state (spec)
 * and the current state (source code), broken into atomic tasks.
 *
 * A plan always references exactly one spec for context. A spec may be
 * referenced by many plans, but each Ralph loop has exactly one plan.
 */
export interface ImplementationPlan {
  /** Absolute path to the plan markdown file. */
  filePath: string;
  /** Path to the spec this plan implements (relative or absolute). */
  specRef: string;
  tasks: Task[];
}

// ---------------------------------------------------------------------------
// Prompt
// ---------------------------------------------------------------------------

/**
 * The prompt fed to the model at the start of every loop iteration.
 *
 * The template can reference variables like {{spec}}, {{plan}}, etc.
 * that are interpolated at runtime.
 */
export interface PromptConfig {
  /** Absolute path to the prompt template. */
  filePath: string;
  /** Raw template content. */
  template: string;
}

// ---------------------------------------------------------------------------
// Loop Configuration
// ---------------------------------------------------------------------------

export type LoopMode = "yolo" | "bounded";

/** Controls how the loop executes. */
export interface LoopConfig {
  mode: LoopMode;
  /** Max iterations before stopping. Only used when mode is "bounded". */
  maxIterations?: number;
  /** Max spend in USD before stopping. Only used when mode is "bounded". */
  budgetUsd?: number;
  /** Model to use for loop iterations. */
  model: string;
}

// ---------------------------------------------------------------------------
// Backpressure
// ---------------------------------------------------------------------------

export type BackpressureTrigger =
  | "each_iteration"
  | "each_task"
  | "pre_commit";

/**
 * A single automated feedback check (type checker, test suite, linter, etc.)
 * that gates task completion.
 */
export interface BackpressureCheck {
  /** Human-readable name (e.g. "TypeScript type check"). */
  name: string;
  /** Shell command to run (e.g. "tsc --noEmit"). */
  command: string;
  /** When this check is executed in the loop lifecycle. */
  trigger: BackpressureTrigger;
}

/** Backpressure configuration for the loop. */
export interface BackpressureConfig {
  checks: BackpressureCheck[];
  /** Optional path to a BACKPRESSURE.md with additional context for the agent. */
  filePath?: string;
}

// ---------------------------------------------------------------------------
// Loop (aggregate root)
// ---------------------------------------------------------------------------

export type LoopStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed"
  | "failed";

/**
 * A Ralph Wiggum loop — the top-level aggregate that ties together all the
 * components needed to run an autonomous coding session.
 *
 * The primary input is the plan (which references a spec). The prompt and
 * backpressure config control how each iteration runs.
 */
export interface RalphLoop {
  id: string;
  name: string;
  /** Absolute path to the target project directory. */
  targetDir: string;
  /** The implementation plan — primary input. References a spec. */
  plan: ImplementationPlan;
  /** The resolved spec (loaded via plan.specRef). */
  spec: Spec;
  prompt: PromptConfig;
  loop: LoopConfig;
  backpressure: BackpressureConfig;
  status: LoopStatus;
  /** Timestamp of loop creation. */
  createdAt: string;
  /** Timestamp of last status change. */
  updatedAt: string;
}
