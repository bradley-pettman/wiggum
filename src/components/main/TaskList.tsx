/**
 * TaskList — interactive scrollable task list with detail pane for the selected task.
 * Shown when docs panel is focused and plan sub-tab is active.
 */

import React from "react";
import { Box, Text } from "ink";
import { useAppState } from "../../state/context.js";
import { useScrollableList } from "../../hooks/use-scrollable-list.js";
import type { Task, TaskStatus } from "../../types/loop.js";

const STATUS_DISPLAY: Record<TaskStatus, { icon: string; color: string }> = {
  pending: { icon: "○", color: "gray" },
  in_progress: { icon: "●", color: "yellow" },
  completed: { icon: "✓", color: "green" },
  skipped: { icon: "–", color: "gray" },
};

export function TaskList() {
  const { loop, selectedTaskIndex } = useAppState();
  const tasks = loop?.plan.tasks ?? [];

  const { visible, startIndex, hasAbove, hasBelow } = useScrollableList(
    tasks,
    selectedTaskIndex,
    10,
  );

  const selectedTask = tasks[selectedTaskIndex];

  if (tasks.length === 0) {
    return (
      <Box padding={1}>
        <Text color="gray">No tasks in plan</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold>Tasks</Text>
      <Text> </Text>

      {/* Task list */}
      {hasAbove && <Text color="gray">  ↑ more</Text>}
      {visible.map((task, i) => {
        const globalIdx = startIndex + i;
        const isSelected = globalIdx === selectedTaskIndex;
        const { icon, color } = STATUS_DISPLAY[task.status];

        return (
          <Box key={task.id} gap={1}>
            <Text color={isSelected ? "cyan" : undefined}>
              {isSelected ? "›" : " "}
            </Text>
            <Text color={color}>{icon}</Text>
            <Text color={isSelected ? "cyan" : color} bold={isSelected}>
              {task.title}
            </Text>
          </Box>
        );
      })}
      {hasBelow && <Text color="gray">  ↓ more</Text>}

      {/* Detail pane for selected task */}
      {selectedTask && <TaskDetail task={selectedTask} />}
    </Box>
  );
}

function TaskDetail({ task }: { task: Task }) {
  const { icon, color } = STATUS_DISPLAY[task.status];

  return (
    <Box flexDirection="column" marginTop={1} borderStyle="single" borderColor="gray" paddingLeft={1} paddingRight={1}>
      <Box gap={1}>
        <Text color={color}>{icon}</Text>
        <Text bold>{task.title}</Text>
      </Box>
      <Text> </Text>
      <Text wrap="wrap">{task.description}</Text>
      <Text> </Text>
      <Box gap={1}>
        <Text color="gray">Priority:</Text>
        <Text>{task.priority}</Text>
      </Box>
      {task.dependencies.length > 0 && (
        <Box gap={1}>
          <Text color="gray">Deps:</Text>
          <Text>{task.dependencies.join(", ")}</Text>
        </Box>
      )}
    </Box>
  );
}
