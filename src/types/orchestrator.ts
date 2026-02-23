/**
 * Types for the orchestration layer.
 *
 * The orchestrator spawns headless `claude -p` processes and streams
 * their NDJSON output to drive the Ralph loop.
 */

import type { RalphLoop, Task } from "./loop.js";
import type { Session, SessionLogEntry } from "./session.js";

// ---------------------------------------------------------------------------
// Loop Runner
// ---------------------------------------------------------------------------

/** Events emitted by the loop runner to the TUI. */
export type LoopRunnerEvent =
  | { type: "iteration_start"; iteration: number; session: Session }
  | { type: "iteration_end"; iteration: number; session: Session }
  | { type: "task_detected"; iteration: number; task: Task }
  | { type: "backpressure_start"; checkName: string }
  | { type: "backpressure_pass"; checkName: string }
  | { type: "backpressure_fail"; checkName: string; output: string }
  | { type: "session_log"; entry: SessionLogEntry }
  | {
      type: "loop_end";
      reason:
        | "completed"
        | "budget_exceeded"
        | "max_iterations"
        | "user_stopped"
        | "error";
      error?: string;
    };

/** Configuration passed to the loop runner when starting a loop. */
export interface LoopRunnerConfig {
  loop: RalphLoop;
  /** Callback for each event. */
  onEvent: (event: LoopRunnerEvent) => void;
  /** AbortSignal to allow the TUI to stop the loop. */
  signal: AbortSignal;
}

// ---------------------------------------------------------------------------
// Prompt Builder
// ---------------------------------------------------------------------------

/** Variables available for interpolation in the prompt template. */
export interface PromptVariables {
  spec: string;
  plan: string;
  backpressure?: string;
  iteration: number;
  remainingBudgetUsd?: number;
  remainingIterations?: number;
}

// ---------------------------------------------------------------------------
// Claude CLI Process
// ---------------------------------------------------------------------------

/**
 * Options for spawning a single `claude -p` process.
 * This is the low-level interface the loop runner uses per iteration.
 */
export interface ClaudeProcessOptions {
  /** The fully-interpolated prompt to pipe into claude. */
  prompt: string;
  /** Working directory for the claude process. */
  cwd: string;
  /** Model override (e.g. "claude-sonnet-4-20250514"). */
  model?: string;
  /** Max turns per session (--max-turns). */
  maxTurns?: number;
  /** Resume a previous session (--resume <session-id>). */
  resumeSessionId?: string;
  /** Run with --dangerously-skip-permissions. */
  skipPermissions: boolean;
  /** AbortSignal to kill the process. */
  signal: AbortSignal;
}
