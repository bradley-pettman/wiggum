/**
 * Pure function that returns the command hints for the bottom bar
 * based on the current panel and sub-tab context.
 */

import type { Command, PanelId, DocsSubTab } from "../types/tui.js";

const GLOBAL_COMMANDS: Command[] = [
  { key: "tab", label: "next pane" },
  { key: "1-3", label: "jump" },
  { key: "q", label: "quit" },
];

export function getCommandsForContext(
  panel: PanelId,
  docsSubTab: DocsSubTab,
  viewingSession: boolean,
): Command[] {
  const contextCommands: Command[] = [];

  switch (panel) {
    case "loop_status":
      contextCommands.push(
        { key: "s", label: "start" },
        { key: "x", label: "stop" },
        { key: "p", label: "pause" },
      );
      break;

    case "docs":
      contextCommands.push(
        { key: "[/]", label: "tab" },
      );
      if (docsSubTab === "plan") {
        contextCommands.push(
          { key: "j/k", label: "navigate" },
        );
      } else {
        contextCommands.push(
          { key: "j/k", label: "scroll" },
        );
      }
      break;

    case "sessions":
      if (viewingSession) {
        contextCommands.push(
          { key: "esc", label: "back" },
          { key: "j/k", label: "scroll" },
        );
      } else {
        contextCommands.push(
          { key: "j/k", label: "navigate" },
          { key: "enter", label: "view" },
        );
      }
      break;
  }

  return [...contextCommands, ...GLOBAL_COMMANDS];
}
