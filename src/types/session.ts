/**
 * Types for loop iteration sessions.
 *
 * Each iteration of a Ralph loop spawns a headless Claude Code session
 * via `claude -p --output-format stream-json`. These types track those
 * sessions and their output.
 */

import type { CLIStreamMessage } from "./claude-cli.js";

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------

export type SessionStatus =
  | "running"
  | "completed"
  | "failed"
  | "interrupted";

/** A single iteration of the loop — one headless Claude Code run. */
export interface Session {
  /** Internal wiggum session ID. */
  id: string;
  /** Claude Code session ID (from the stream-json init message). */
  claudeSessionId: string;
  /** The loop this session belongs to. */
  loopId: string;
  /** 1-indexed iteration number within the loop. */
  iteration: number;
  /** ISO timestamp. */
  startedAt: string;
  /** ISO timestamp. Undefined while running. */
  endedAt?: string;
  status: SessionStatus;
  /** ID of the task the agent chose to work on (if detected). */
  taskWorkedOn?: string;
  /** Git commit SHA produced by this session (if any). */
  commitHash?: string;
  /** Total cost in USD for this session. */
  costUsd?: number;
  /** Total input + output tokens consumed. */
  tokensUsed?: number;
  /** Number of agentic turns in the session. */
  numTurns?: number;
  /** Wall-clock duration in ms. */
  durationMs?: number;
  /** Path to the session transcript (NDJSON log file). */
  logPath: string;
}

// ---------------------------------------------------------------------------
// Session Log Event
// ---------------------------------------------------------------------------

/**
 * A timestamped wrapper around a raw CLI stream message,
 * persisted to the session's NDJSON log file.
 */
export interface SessionLogEntry {
  /** ISO timestamp when this message was received. */
  timestamp: string;
  /** The raw message from `claude -p --output-format stream-json`. */
  message: CLIStreamMessage;
}

// ---------------------------------------------------------------------------
// Session Summary (for the TUI list view)
// ---------------------------------------------------------------------------

/** Lightweight session info for display in the sessions panel. */
export interface SessionSummary {
  id: string;
  iteration: number;
  status: SessionStatus;
  taskTitle?: string;
  costUsd?: number;
  numTurns?: number;
  durationMs?: number;
}
