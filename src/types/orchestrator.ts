/**
 * Types for the orchestration layer.
 *
 * The orchestrator uses the Anthropic Agent SDK to spawn and manage
 * headless Claude Code sessions that execute the Ralph loop.
 */

import type { RalphLoop, Task } from "./loop.js";
import type { Session, SessionLogEvent } from "./session.js";

// ---------------------------------------------------------------------------
// Loop Runner
// ---------------------------------------------------------------------------

/** Events emitted by the loop runner to the TUI. */
export type LoopRunnerEvent =
  | { type: "iteration_start"; iteration: number; session: Session }
  | { type: "iteration_end"; iteration: number; session: Session }
  | {
      type: "task_detected";
      iteration: number;
      task: Task;
    }
  | { type: "backpressure_start"; checkName: string }
  | { type: "backpressure_pass"; checkName: string }
  | {
      type: "backpressure_fail";
      checkName: string;
      output: string;
    }
  | { type: "session_log"; event: SessionLogEvent }
  | {
      type: "loop_end";
      reason: "completed" | "budget_exceeded" | "max_iterations" | "user_stopped" | "error";
      error?: string;
    };

/** Configuration passed to the loop runner when starting a loop. */
export interface LoopRunnerConfig {
  loop: RalphLoop;
  /** Callback for each event. */
  onEvent: (event: LoopRunnerEvent) => void;
  /** AbortController to allow the TUI to stop the loop. */
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
// Session Watcher
// ---------------------------------------------------------------------------

/**
 * The session watcher streams Agent SDK messages in real-time
 * and persists them to the session log file.
 */
export interface SessionWatcher {
  /** Start watching a session. Returns when the session ends. */
  watch(session: Session): Promise<void>;
  /** Get the latest N log events for a session. */
  tail(sessionId: string, n: number): SessionLogEvent[];
}
