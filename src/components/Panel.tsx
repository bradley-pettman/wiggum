/**
 * Bordered panel with [N]-Title header. Cyan border when focused, gray when not.
 */

import React from "react";
import { Box, Text } from "ink";
import type { PanelId } from "../types/tui.js";
import { PANELS } from "../types/tui.js";

interface PanelProps {
  panelId: PanelId;
  isFocused: boolean;
  children: React.ReactNode;
  height?: number | string;
  width?: number | string;
}

export function Panel({ panelId, isFocused, children, height, width }: PanelProps) {
  const panel = PANELS.find((p) => p.id === panelId)!;
  const borderColor = isFocused ? "cyan" : "gray";

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={borderColor}
      height={height as number | undefined}
      width={width as number | undefined}
      paddingLeft={1}
      paddingRight={1}
    >
      <Box>
        <Text color={borderColor} bold={isFocused}>
          [{panel.shortcut}] {panel.title}
        </Text>
      </Box>
      {children}
    </Box>
  );
}
