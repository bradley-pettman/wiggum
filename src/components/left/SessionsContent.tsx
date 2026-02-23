/**
 * Content for the Sessions panel — scrollable session list with selection highlight.
 */

import React from "react";
import { Box, Text } from "ink";
import { useAppState } from "../../state/context.js";
import { useScrollableList } from "../../hooks/use-scrollable-list.js";
import type { SessionStatus } from "../../types/session.js";

const STATUS_ICON: Record<SessionStatus, { icon: string; color: string }> = {
  running: { icon: "●", color: "green" },
  completed: { icon: "✓", color: "green" },
  failed: { icon: "✗", color: "red" },
  interrupted: { icon: "!", color: "yellow" },
};

const VIEWPORT_HEIGHT = 8;

export function SessionsContent() {
  const { sessions, selectedSessionIndex, activePanel } = useAppState();
  const isFocused = activePanel === "sessions";

  const { visible, startIndex, hasAbove, hasBelow } = useScrollableList(
    sessions,
    selectedSessionIndex,
    VIEWPORT_HEIGHT,
  );

  if (sessions.length === 0) {
    return <Text color="gray">No sessions yet</Text>;
  }

  return (
    <Box flexDirection="column">
      {hasAbove && <Text color="gray">  ↑ more</Text>}
      {visible.map((session, i) => {
        const globalIdx = startIndex + i;
        const isSelected = isFocused && globalIdx === selectedSessionIndex;
        const { icon, color } = STATUS_ICON[session.status];
        const cost = session.costUsd != null ? `$${session.costUsd.toFixed(2)}` : "";

        return (
          <Box key={session.id} gap={1}>
            <Text color={isSelected ? "cyan" : undefined} bold={isSelected}>
              {isSelected ? "›" : " "}
            </Text>
            <Text color={color}>{icon}</Text>
            <Text color={isSelected ? "cyan" : undefined} bold={isSelected}>
              #{session.iteration}
            </Text>
            <Text dimColor>{session.taskTitle ?? "—"}</Text>
            <Text color="yellow">{cost}</Text>
          </Box>
        );
      })}
      {hasBelow && <Text color="gray">  ↓ more</Text>}
    </Box>
  );
}
