/**
 * Content for the Loop Status panel — status badge, iteration count, model, cost.
 */

import React from "react";
import { Box, Text } from "ink";
import { useAppState } from "../../state/context.js";
import type { LoopStatus } from "../../types/loop.js";

const STATUS_ICON: Record<LoopStatus, { icon: string; color: string }> = {
  idle: { icon: "○", color: "gray" },
  running: { icon: "●", color: "green" },
  paused: { icon: "◐", color: "yellow" },
  completed: { icon: "✓", color: "green" },
  failed: { icon: "✗", color: "red" },
};

export function LoopStatusContent() {
  const { loop, loopStatus, sessions } = useAppState();

  const { icon, color } = STATUS_ICON[loopStatus];
  const totalCost = sessions.reduce((sum, s) => sum + (s.costUsd ?? 0), 0);
  const totalTurns = sessions.reduce((sum, s) => sum + (s.numTurns ?? 0), 0);

  return (
    <Box flexDirection="column" gap={0}>
      <Box gap={1}>
        <Text color={color}>{icon}</Text>
        <Text color={color} bold>
          {loopStatus.toUpperCase()}
        </Text>
      </Box>
      {loop ? (
        <>
          <Text>
            <Text color="gray">Name: </Text>
            <Text>{loop.name}</Text>
          </Text>
          <Text>
            <Text color="gray">Model: </Text>
            <Text>{loop.loop.model}</Text>
          </Text>
          <Text>
            <Text color="gray">Mode: </Text>
            <Text>{loop.loop.mode}</Text>
            {loop.loop.maxIterations != null && (
              <Text color="gray"> (max {loop.loop.maxIterations})</Text>
            )}
          </Text>
          <Text>
            <Text color="gray">Iterations: </Text>
            <Text>{sessions.length}</Text>
          </Text>
          <Text>
            <Text color="gray">Cost: </Text>
            <Text color="yellow">${totalCost.toFixed(2)}</Text>
            {loop.loop.budgetUsd != null && (
              <Text color="gray"> / ${loop.loop.budgetUsd.toFixed(2)}</Text>
            )}
          </Text>
          <Text>
            <Text color="gray">Turns: </Text>
            <Text>{totalTurns}</Text>
          </Text>
        </>
      ) : (
        <Text color="gray">No loop loaded</Text>
      )}
    </Box>
  );
}
