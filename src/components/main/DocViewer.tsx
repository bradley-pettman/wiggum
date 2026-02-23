/**
 * DocViewer — scrollable text viewer for spec, prompt, and backpressure docs.
 */

import React from "react";
import { Box, Text } from "ink";
import { useAppState } from "../../state/context.js";
import { MOCK_DOC_CONTENT } from "../../state/mock-data.js";

export function DocViewer({ docType }: { docType: "spec" | "prompt" | "backpressure" }) {
  const { docScrollOffset } = useAppState();

  const content = MOCK_DOC_CONTENT[docType] ?? "";
  const lines = content.split("\n");
  const visibleLines = lines.slice(docScrollOffset, docScrollOffset + 30);
  const hasAbove = docScrollOffset > 0;
  const hasBelow = docScrollOffset + 30 < lines.length;

  const title =
    docType === "spec"
      ? "Spec"
      : docType === "prompt"
        ? "Prompt Template"
        : "Backpressure";

  return (
    <Box flexDirection="column" padding={1}>
      <Box gap={1}>
        <Text bold>{title}</Text>
        <Text color="gray">
          (line {docScrollOffset + 1}-{Math.min(docScrollOffset + 30, lines.length)} of{" "}
          {lines.length})
        </Text>
      </Box>
      <Text> </Text>

      {hasAbove && <Text color="gray">↑ scroll up (k)</Text>}
      {visibleLines.map((line, i) => (
        <Text key={docScrollOffset + i}>{line || " "}</Text>
      ))}
      {hasBelow && <Text color="gray">↓ scroll down (j)</Text>}
    </Box>
  );
}
