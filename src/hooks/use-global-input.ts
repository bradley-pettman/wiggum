/**
 * Central keyboard handler — a single useInput at the root routes
 * all keystrokes based on activePanel / docsSubTab.
 */

import { useInput, useApp } from "ink";
import type { AppState, AppAction } from "../types/tui.js";
import type { PanelId } from "../types/tui.js";
import { cyclePanel, cycleDocsSubTab } from "../state/reducer.js";

export function useGlobalInput(
  state: AppState,
  dispatch: React.Dispatch<AppAction>,
) {
  const { exit } = useApp();

  useInput((input, key) => {
    // --- Global keys ---

    // Quit
    if (input === "q") {
      exit();
      return;
    }

    // Tab / Shift+Tab cycle panels
    if (key.tab) {
      const direction = key.shift ? -1 : 1;
      dispatch({ type: "FOCUS_PANEL", panel: cyclePanel(state.activePanel, direction) });
      return;
    }

    // Number keys jump to panel
    const panelMap: Record<string, PanelId> = {
      "1": "loop_status",
      "2": "docs",
      "3": "sessions",
    };
    if (panelMap[input]) {
      dispatch({ type: "FOCUS_PANEL", panel: panelMap[input] });
      return;
    }

    // --- Panel-specific keys ---

    if (state.activePanel === "loop_status") {
      handleLoopStatusInput(input, dispatch);
      return;
    }

    if (state.activePanel === "docs") {
      handleDocsInput(input, state, dispatch);
      return;
    }

    if (state.activePanel === "sessions") {
      handleSessionsInput(input, key, state, dispatch);
      return;
    }
  });
}

function handleLoopStatusInput(
  input: string,
  dispatch: React.Dispatch<AppAction>,
) {
  switch (input) {
    case "s":
      dispatch({ type: "UPDATE_LOOP_STATUS", status: "running" });
      dispatch({ type: "SET_STATUS", message: "Loop started (stub)" });
      break;
    case "x":
      dispatch({ type: "UPDATE_LOOP_STATUS", status: "idle" });
      dispatch({ type: "SET_STATUS", message: "Loop stopped (stub)" });
      break;
    case "p":
      dispatch({ type: "UPDATE_LOOP_STATUS", status: "paused" });
      dispatch({ type: "SET_STATUS", message: "Loop paused (stub)" });
      break;
  }
}

function handleDocsInput(
  input: string,
  state: AppState,
  dispatch: React.Dispatch<AppAction>,
) {
  // [/] cycle tabs
  if (input === "[") {
    dispatch({ type: "SET_DOCS_SUB_TAB", tab: cycleDocsSubTab(state.docsSubTab, -1) });
    return;
  }
  if (input === "]") {
    dispatch({ type: "SET_DOCS_SUB_TAB", tab: cycleDocsSubTab(state.docsSubTab, 1) });
    return;
  }

  // j/k navigation depends on sub-tab
  if (state.docsSubTab === "plan") {
    // Navigate tasks
    const tasks = state.loop?.plan.tasks ?? [];
    if (input === "j" && state.selectedTaskIndex < tasks.length - 1) {
      dispatch({ type: "SELECT_TASK", index: state.selectedTaskIndex + 1 });
    }
    if (input === "k" && state.selectedTaskIndex > 0) {
      dispatch({ type: "SELECT_TASK", index: state.selectedTaskIndex - 1 });
    }
  } else {
    // Scroll doc content
    if (input === "j") {
      dispatch({ type: "SCROLL_DOC", delta: 1 });
    }
    if (input === "k") {
      dispatch({ type: "SCROLL_DOC", delta: -1 });
    }
  }
}

function handleSessionsInput(
  input: string,
  key: { return: boolean; escape: boolean },
  state: AppState,
  dispatch: React.Dispatch<AppAction>,
) {
  // Esc to go back from session viewer
  if (key.escape && state.viewingSession) {
    dispatch({ type: "BACK_TO_LIST" });
    return;
  }

  // Enter to view selected session
  if (key.return && !state.viewingSession && state.sessions.length > 0) {
    const session = state.sessions[state.selectedSessionIndex]!;
    // We create a mock full Session from the summary for the viewer
    dispatch({
      type: "VIEW_SESSION",
      session: {
        id: session.id,
        claudeSessionId: `claude-${session.id}`,
        loopId: "loop-001",
        iteration: session.iteration,
        startedAt: new Date().toISOString(),
        status: session.status,
        costUsd: session.costUsd,
        numTurns: session.numTurns,
        durationMs: session.durationMs,
        taskWorkedOn: undefined,
        logPath: `/tmp/wiggum/${session.id}.jsonl`,
      },
      live: session.status === "running",
    });
    return;
  }

  // j/k navigate session list
  if (input === "j" && state.selectedSessionIndex < state.sessions.length - 1) {
    dispatch({ type: "SELECT_SESSION", index: state.selectedSessionIndex + 1 });
  }
  if (input === "k" && state.selectedSessionIndex > 0) {
    dispatch({ type: "SELECT_SESSION", index: state.selectedSessionIndex - 1 });
  }
}
