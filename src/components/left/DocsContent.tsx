/**
 * Content for the Docs panel — tab bar + per-tab summary.
 */

import React from "react";
import { Box, Text } from "ink";
import { useAppState } from "../../state/context.js";
import { DOCS_SUB_TABS } from "../../types/tui.js";

export function DocsContent() {
  const { docsSubTab, loop } = useAppState();

  return (
    <Box flexDirection="column">
      {/* Tab bar */}
      <Box gap={1}>
        {DOCS_SUB_TABS.map((tab) => {
          const active = tab.id === docsSubTab;
          return (
            <Text key={tab.id} color={active ? "cyan" : "gray"} bold={active}>
              {active ? `[${tab.label}]` : ` ${tab.label} `}
            </Text>
          );
        })}
      </Box>

      {/* Summary for the selected tab */}
      <Box marginTop={1} flexDirection="column">
        {docsSubTab === "plan" && (
          <PlanSummary
            tasks={loop?.plan.tasks ?? []}
          />
        )}
        {docsSubTab === "spec" && (
          <Text color="gray">
            {loop?.spec.filePath ?? "No spec loaded"}
          </Text>
        )}
        {docsSubTab === "prompt" && (
          <Text color="gray">
            {loop?.prompt.filePath ?? "No prompt loaded"}
          </Text>
        )}
        {docsSubTab === "backpressure" && (
          <BpSummary checks={loop?.backpressure.checks.length ?? 0} />
        )}
      </Box>
    </Box>
  );
}

function PlanSummary({ tasks }: { tasks: { status: string }[] }) {
  const done = tasks.filter((t) => t.status === "completed").length;
  const inProg = tasks.filter((t) => t.status === "in_progress").length;
  const total = tasks.length;

  return (
    <Box flexDirection="column">
      <Text>
        <Text color="green">{done}</Text>
        <Text color="gray"> done </Text>
        <Text color="yellow">{inProg}</Text>
        <Text color="gray"> active </Text>
        <Text>{total}</Text>
        <Text color="gray"> total</Text>
      </Text>
    </Box>
  );
}

function BpSummary({ checks }: { checks: number }) {
  return (
    <Text>
      <Text>{checks}</Text>
      <Text color="gray"> check{checks !== 1 ? "s" : ""} configured</Text>
    </Text>
  );
}
