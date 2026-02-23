/**
 * Dashboard — loop config summary + cumulative stats.
 * Shown when loop_status panel is focused.
 */

import React from "react";
import { Box, Text } from "ink";
import { useAppState } from "../../state/context.js";

export function Dashboard() {
  const { loop, loopStatus, sessions } = useAppState();

  const totalCost = sessions.reduce((sum, s) => sum + (s.costUsd ?? 0), 0);
  const totalTurns = sessions.reduce((sum, s) => sum + (s.numTurns ?? 0), 0);
  const totalDuration = sessions.reduce((sum, s) => sum + (s.durationMs ?? 0), 0);
  const completedSessions = sessions.filter((s) => s.status === "completed").length;
  const failedSessions = sessions.filter((s) => s.status === "failed").length;

  if (!loop) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text bold>Dashboard</Text>
        <Text color="gray">No loop loaded. Run wiggum in a project directory with .wiggum/ config.</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold>Dashboard</Text>
      <Text> </Text>

      {/* Loop Config */}
      <Text bold color="cyan">Loop Configuration</Text>
      <Row label="Name" value={loop.name} />
      <Row label="Target" value={loop.targetDir} />
      <Row label="Model" value={loop.loop.model} />
      <Row label="Mode" value={loop.loop.mode} />
      {loop.loop.maxIterations != null && (
        <Row label="Max Iterations" value={String(loop.loop.maxIterations)} />
      )}
      {loop.loop.budgetUsd != null && (
        <Row label="Budget" value={`$${loop.loop.budgetUsd.toFixed(2)}`} />
      )}
      <Row label="Status" value={loopStatus.toUpperCase()} />
      <Text> </Text>

      {/* Cumulative Stats */}
      <Text bold color="cyan">Cumulative Stats</Text>
      <Row label="Sessions" value={`${sessions.length} (${completedSessions} ok, ${failedSessions} failed)`} />
      <Row label="Total Cost" value={`$${totalCost.toFixed(2)}`} />
      <Row label="Total Turns" value={String(totalTurns)} />
      <Row label="Total Time" value={formatDuration(totalDuration)} />
      <Text> </Text>

      {/* Backpressure */}
      <Text bold color="cyan">Backpressure Checks</Text>
      {loop.backpressure.checks.map((check) => (
        <Box key={check.name} gap={1}>
          <Text color="gray">  •</Text>
          <Text>{check.name}</Text>
          <Text color="gray">({check.trigger})</Text>
        </Box>
      ))}

      {/* Tasks summary */}
      <Text> </Text>
      <Text bold color="cyan">Plan Progress</Text>
      {loop.plan.tasks.map((task) => {
        const statusColor =
          task.status === "completed"
            ? "green"
            : task.status === "in_progress"
              ? "yellow"
              : "gray";
        const icon =
          task.status === "completed"
            ? "✓"
            : task.status === "in_progress"
              ? "●"
              : "○";
        return (
          <Box key={task.id} gap={1}>
            <Text color={statusColor}>  {icon}</Text>
            <Text color={statusColor}>{task.title}</Text>
          </Box>
        );
      })}
    </Box>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Box gap={1}>
      <Text color="gray">  {label}:</Text>
      <Text>{value}</Text>
    </Box>
  );
}

function formatDuration(ms: number): string {
  if (ms === 0) return "—";
  const secs = Math.floor(ms / 1000);
  const mins = Math.floor(secs / 60);
  const remainingSecs = secs % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${remainingSecs}s`;
}
