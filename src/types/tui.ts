/**
 * Types for the TUI (terminal user interface) layer.
 *
 * The TUI is a lazygit-style multi-panel interface built with Ink.
 * Three left panes (Loop Status, Docs, Sessions) with a large main
 * view on the right that changes based on context. The Docs pane has
 * sub-tabs (Plan, Spec, Prompt, Backpressure) cycled with h/l.
 */

import type { RalphLoop, LoopStatus, Task } from "./loop.js";
import type { Session, SessionSummary } from "./session.js";

// ---------------------------------------------------------------------------
// Panels (left side)
// ---------------------------------------------------------------------------

/** The three left-side panes, navigated with Tab or 1-3. */
export type PanelId = "loop_status" | "docs" | "sessions";

export interface PanelDef {
  id: PanelId;
  /** Display title shown in the panel border. */
  title: string;
  /** Keyboard shortcut to jump to this panel. */
  shortcut: string;
}

export const PANELS: PanelDef[] = [
  { id: "loop_status", title: "Loop Status", shortcut: "1" },
  { id: "docs", title: "Docs", shortcut: "2" },
  { id: "sessions", title: "Sessions", shortcut: "3" },
];

// ---------------------------------------------------------------------------
// Docs sub-tabs (within the Docs pane)
// ---------------------------------------------------------------------------

/** Sub-tabs within the Docs pane, cycled with h/l or ←/→. */
export type DocsSubTab = "plan" | "spec" | "prompt" | "backpressure";

export interface DocsSubTabDef {
  id: DocsSubTab;
  label: string;
}

export const DOCS_SUB_TABS: DocsSubTabDef[] = [
  { id: "plan", label: "Plan" },
  { id: "spec", label: "Spec" },
  { id: "prompt", label: "Prompt" },
  { id: "backpressure", label: "BP" },
];

// ---------------------------------------------------------------------------
// Main view (right side) — content changes based on left pane + sub-tab
// ---------------------------------------------------------------------------

/**
 * What the main view displays, derived from current focus:
 *
 *   loop_status          → Dashboard: config summary, cumulative stats
 *   docs / plan          → Interactive task list from the plan
 *   docs / spec          → Rendered SPEC.md content (scrollable)
 *   docs / prompt        → PROMPT.md template (scrollable)
 *   docs / backpressure  → Check config + last run results
 *   sessions             → Live/historical session stream viewer
 */
export type MainViewMode =
  | { kind: "dashboard" }
  | { kind: "tasks" }
  | { kind: "doc_viewer"; docType: "spec" | "prompt" | "backpressure" }
  | { kind: "session_viewer"; sessionId: string; live: boolean };

// ---------------------------------------------------------------------------
// App State
// ---------------------------------------------------------------------------

/** Global application state managed by the TUI. */
export interface AppState {
  /** Which left pane currently has focus. */
  activePanel: PanelId;
  /** Active sub-tab within the Docs pane. */
  docsSubTab: DocsSubTab;
  /** The loaded loop configuration (null if nothing is loaded). */
  loop: RalphLoop | null;
  /** Overall loop execution status. */
  loopStatus: LoopStatus;
  /** All sessions for the current loop. */
  sessions: SessionSummary[];
  /** Index of the selected session in the sessions list. */
  selectedSessionIndex: number;
  /** The session currently being viewed in the main pane. */
  viewingSession: Session | null;
  /** Whether the session viewer is following live output. */
  viewerLive: boolean;
  /** Index of the selected task in the plan's task list. */
  selectedTaskIndex: number;
  /** What the main view is currently showing. */
  mainView: MainViewMode;
  /** Status bar message. */
  statusMessage: string;
}

// ---------------------------------------------------------------------------
// Actions (state transitions)
// ---------------------------------------------------------------------------

export type AppAction =
  | { type: "FOCUS_PANEL"; panel: PanelId }
  | { type: "SET_DOCS_SUB_TAB"; tab: DocsSubTab }
  | { type: "LOAD_LOOP"; loop: RalphLoop }
  | { type: "UPDATE_LOOP_STATUS"; status: LoopStatus }
  | { type: "ADD_SESSION"; session: SessionSummary }
  | { type: "UPDATE_SESSION"; session: SessionSummary }
  | { type: "SELECT_SESSION"; index: number }
  | { type: "VIEW_SESSION"; session: Session; live: boolean }
  | { type: "SELECT_TASK"; index: number }
  | { type: "UPDATE_TASK"; task: Task }
  | { type: "SET_STATUS"; message: string };

// ---------------------------------------------------------------------------
// Commands (shown in the bottom bar, dynamic per context)
// ---------------------------------------------------------------------------

export interface Command {
  key: string;
  label: string;
}

/**
 * Commands change based on active panel + sub-tab.
 *
 * Examples:
 *   loop_status → s:start  x:stop  p:pause  m:model  y:yolo/bounded
 *   docs/plan   → e:edit  space:toggle  n:new  d:delete
 *   docs/spec   → e:edit  r:reload
 *   docs/prompt → e:edit  r:reload
 *   docs/bp     → e:edit  n:new check  d:delete  space:run now
 *   sessions    → enter:view  f:follow live  ↑↓:navigate
 *
 * Global:  tab:next pane  1-3:jump  q:quit  ?:help  @:command log
 */
export type CommandContext =
  | { panel: "loop_status" }
  | { panel: "docs"; subTab: DocsSubTab }
  | { panel: "sessions" };

// ---------------------------------------------------------------------------
// Keybindings
// ---------------------------------------------------------------------------

export interface Keybinding {
  key: string;
  description: string;
  /** Scope — undefined means global. */
  context?: CommandContext;
  action: AppAction | "START_LOOP" | "STOP_LOOP" | "PAUSE_LOOP" | "QUIT" | "HELP" | "TOGGLE_LOG";
}
