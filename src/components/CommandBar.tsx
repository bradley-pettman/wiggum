/**
 * Dynamic bottom command bar — shows available keyboard shortcuts
 * based on the current context.
 */

import React from "react";
import { Box, Text } from "ink";
import { useAppState } from "../state/context.js";
import { getCommandsForContext } from "../lib/commands.js";

export function CommandBar() {
  const state = useAppState();
  const commands = getCommandsForContext(
    state.activePanel,
    state.docsSubTab,
    state.viewingSession !== null,
  );

  return (
    <Box paddingLeft={1} gap={1}>
      {commands.map((cmd) => (
        <Box key={cmd.key} gap={0}>
          <Text color="cyan" bold>
            {cmd.key}
          </Text>
          <Text color="gray">:{cmd.label}</Text>
        </Box>
      ))}
      {state.statusMessage ? (
        <Box marginLeft={1}>
          <Text color="yellow">{state.statusMessage}</Text>
        </Box>
      ) : null}
    </Box>
  );
}
