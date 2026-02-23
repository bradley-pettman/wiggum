/**
 * Types for loop iteration sessions.
 *
 * Each iteration of a Ralph loop spawns a headless Claude Code session
 * via the Agent SDK. These types track those sessions and their output.
 */

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
  /** Claude Code session ID (from the Agent SDK init message). */
  agentSessionId: string;
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
  /** Total tokens consumed. */
  tokensUsed?: number;
  /** Path to the session transcript / log file. */
  logPath: string;
}

// ---------------------------------------------------------------------------
// Session Log Events (streamed from the Agent SDK)
// ---------------------------------------------------------------------------

export type SessionLogEventType =
  | "system_init"
  | "assistant_text"
  | "assistant_tool_use"
  | "tool_result"
  | "error"
  | "result";

/** A single event in the session log, derived from Agent SDK SDKMessages. */
export interface SessionLogEvent {
  timestamp: string;
  type: SessionLogEventType;
  /** The raw event payload (shape depends on type). */
  data: unknown;
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
  duration?: number; // seconds
}
