/**
 * App state reducer, initial state factory, and main view derivation.
 */

import type {
  AppState,
  AppAction,
  MainViewMode,
  PanelId,
  DocsSubTab,
} from "../types/tui.js";
import type { RalphLoop } from "../types/loop.js";
import type { SessionSummary } from "../types/session.js";
import { DOCS_SUB_TABS } from "../types/tui.js";

/** Derive what the main view should show based on current focus. */
export function deriveMainView(
  activePanel: PanelId,
  docsSubTab: DocsSubTab,
  viewingSessionId: string | null,
  viewerLive: boolean,
): MainViewMode {
  if (activePanel === "loop_status") {
    return { kind: "dashboard" };
  }
  if (activePanel === "sessions") {
    if (viewingSessionId) {
      return { kind: "session_viewer", sessionId: viewingSessionId, live: viewerLive };
    }
    // When sessions panel is focused but no session is being viewed,
    // show dashboard as default
    return { kind: "dashboard" };
  }
  // docs panel
  if (docsSubTab === "plan") {
    return { kind: "tasks" };
  }
  return { kind: "doc_viewer", docType: docsSubTab };
}

export function createInitialState(
  loop: RalphLoop | null,
  sessions: SessionSummary[],
): AppState {
  const activePanel: PanelId = "loop_status";
  const docsSubTab: DocsSubTab = "plan";
  return {
    activePanel,
    docsSubTab,
    loop,
    loopStatus: loop?.status ?? "idle",
    sessions,
    selectedSessionIndex: 0,
    viewingSession: null,
    viewerLive: false,
    selectedTaskIndex: 0,
    mainView: deriveMainView(activePanel, docsSubTab, null, false),
    docScrollOffset: 0,
    statusMessage: loop ? `Loaded: ${loop.name}` : "No loop loaded",
  };
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "FOCUS_PANEL": {
      const mainView = deriveMainView(
        action.panel,
        state.docsSubTab,
        state.viewingSession?.id ?? null,
        state.viewerLive,
      );
      return { ...state, activePanel: action.panel, mainView, docScrollOffset: 0 };
    }

    case "SET_DOCS_SUB_TAB": {
      const mainView = deriveMainView(
        state.activePanel,
        action.tab,
        state.viewingSession?.id ?? null,
        state.viewerLive,
      );
      return { ...state, docsSubTab: action.tab, mainView, docScrollOffset: 0 };
    }

    case "LOAD_LOOP":
      return {
        ...state,
        loop: action.loop,
        loopStatus: action.loop.status,
        selectedTaskIndex: 0,
        statusMessage: `Loaded: ${action.loop.name}`,
      };

    case "UPDATE_LOOP_STATUS":
      return { ...state, loopStatus: action.status };

    case "ADD_SESSION":
      return { ...state, sessions: [...state.sessions, action.session] };

    case "UPDATE_SESSION":
      return {
        ...state,
        sessions: state.sessions.map((s) =>
          s.id === action.session.id ? action.session : s,
        ),
      };

    case "SELECT_SESSION": {
      const idx = Math.max(0, Math.min(action.index, state.sessions.length - 1));
      return { ...state, selectedSessionIndex: idx };
    }

    case "VIEW_SESSION": {
      const mainView = deriveMainView(
        state.activePanel,
        state.docsSubTab,
        action.session.id,
        action.live,
      );
      return {
        ...state,
        viewingSession: action.session,
        viewerLive: action.live,
        mainView,
      };
    }

    case "BACK_TO_LIST": {
      const mainView = deriveMainView(
        state.activePanel,
        state.docsSubTab,
        null,
        false,
      );
      return {
        ...state,
        viewingSession: null,
        viewerLive: false,
        mainView,
      };
    }

    case "SELECT_TASK": {
      const tasks = state.loop?.plan.tasks ?? [];
      const idx = Math.max(0, Math.min(action.index, tasks.length - 1));
      return { ...state, selectedTaskIndex: idx };
    }

    case "UPDATE_TASK": {
      if (!state.loop) return state;
      const tasks = state.loop.plan.tasks.map((t) =>
        t.id === action.task.id ? action.task : t,
      );
      return {
        ...state,
        loop: { ...state.loop, plan: { ...state.loop.plan, tasks } },
      };
    }

    case "SCROLL_DOC": {
      const newOffset = Math.max(0, state.docScrollOffset + action.delta);
      return { ...state, docScrollOffset: newOffset };
    }

    case "SET_STATUS":
      return { ...state, statusMessage: action.message };

    default:
      return state;
  }
}

/** Get the next/previous docs sub-tab. */
export function cycleDocsSubTab(current: DocsSubTab, direction: 1 | -1): DocsSubTab {
  const tabs = DOCS_SUB_TABS;
  const idx = tabs.findIndex((t) => t.id === current);
  const next = (idx + direction + tabs.length) % tabs.length;
  return tabs[next]!.id;
}

/** Get the next/previous panel. */
export function cyclePanel(current: PanelId, direction: 1 | -1): PanelId {
  const panels: PanelId[] = ["loop_status", "docs", "sessions"];
  const idx = panels.indexOf(current);
  const next = (idx + direction + panels.length) % panels.length;
  return panels[next]!;
}
