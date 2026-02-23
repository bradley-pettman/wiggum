/**
 * SessionViewer — placeholder for viewing session transcripts.
 */

import React from "react";
import { Box, Text } from "ink";
import { useAppState } from "../../state/context.js";

export function SessionViewer({ sessionId, live }: { sessionId: string; live: boolean }) {
  const { sessions } = useAppState();
  const session = sessions.find((s) => s.id === sessionId);

  return (
    <Box flexDirection="column" padding={1}>
      <Box gap={1}>
        <Text bold>Session Viewer</Text>
        {live && <Text color="green">[LIVE]</Text>}
      </Box>
      <Text> </Text>

      {session ? (
        <Box flexDirection="column">
          <Row label="Session" value={`#${session.iteration} (${session.id})`} />
          <Row label="Status" value={session.status} />
          {session.taskTitle && <Row label="Task" value={session.taskTitle} />}
          {session.costUsd != null && <Row label="Cost" value={`$${session.costUsd.toFixed(2)}`} />}
          {session.numTurns != null && <Row label="Turns" value={String(session.numTurns)} />}
          <Text> </Text>
          <Text color="gray">Transcript viewer not yet implemented.</Text>
          <Text color="gray">Press Esc to return to session list.</Text>
        </Box>
      ) : (
        <Text color="gray">Session {sessionId} not found</Text>
      )}
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
