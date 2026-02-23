/**
 * Types for the TUI (terminal user interface) layer.
 *
 * The TUI is a lazygit-style multi-panel interface built with Ink.
 * These types describe the UI state, panel layout, and keybindings.
 */

import type { RalphLoop, LoopStatus, Task } from "./loop.js";
import type { Session, SessionSummary } from "./session.js";

// ---------------------------------------------------------------------------
// Panels
// ---------------------------------------------------------------------------

/** Identifiers for each panel in the TUI. */
export type PanelId =
  | "spec"
  | "plan"
  | "prompt"
  | "loop_config"
  | "backpressure"
  | "sessions"
  | "viewer";

export interface PanelDef {
  id: PanelId;
  /** Display title shown in the panel border. */
  title: string;
  /** Keyboard shortcut to jump to this panel (1-7). */
  shortcut: string;
}

/** Static panel definitions. */
export const PANELS: PanelDef[] = [
  { id: "spec", title: "Spec", shortcut: "1" },
  { id: "plan", title: "Plan", shortcut: "2" },
  { id: "prompt", title: "Prompt", shortcut: "3" },
  { id: "loop_config", title: "Loop", shortcut: "4" },
  { id: "backpressure", title: "Backpressure", shortcut: "5" },
  { id: "sessions", title: "Sessions", shortcut: "6" },
  { id: "viewer", title: "Viewer", shortcut: "7" },
];

// ---------------------------------------------------------------------------
// App State
// ---------------------------------------------------------------------------

/** Global application state managed by the TUI. */
export interface AppState {
  /** Which panel currently has focus. */
  activePanel: PanelId;
  /** The loaded loop configuration (null if nothing is loaded). */
  loop: RalphLoop | null;
  /** Overall loop execution status. */
  loopStatus: LoopStatus;
  /** All sessions for the current loop. */
  sessions: SessionSummary[];
  /** The session currently being viewed in the viewer panel. */
  viewingSession: Session | null;
  /** Whether the viewer is showing live streaming output. */
  viewerLive: boolean;
  /** Currently selected task in the plan panel. */
  selectedTaskId: string | null;
  /** Status bar message. */
  statusMessage: string;
}

// ---------------------------------------------------------------------------
// Actions (state transitions)
// ---------------------------------------------------------------------------

export type AppAction =
  | { type: "FOCUS_PANEL"; panel: PanelId }
  | { type: "LOAD_LOOP"; loop: RalphLoop }
  | { type: "UPDATE_LOOP_STATUS"; status: LoopStatus }
  | { type: "ADD_SESSION"; session: SessionSummary }
  | { type: "UPDATE_SESSION"; session: SessionSummary }
  | { type: "VIEW_SESSION"; session: Session }
  | { type: "VIEW_LIVE" }
  | { type: "SELECT_TASK"; taskId: string }
  | { type: "UPDATE_TASK"; task: Task }
  | { type: "SET_STATUS"; message: string };

// ---------------------------------------------------------------------------
// Keybindings
// ---------------------------------------------------------------------------

export interface Keybinding {
  key: string;
  description: string;
  /** Panel scope — undefined means global. */
  panel?: PanelId;
  action: AppAction | "START_LOOP" | "STOP_LOOP" | "PAUSE_LOOP" | "QUIT";
}
