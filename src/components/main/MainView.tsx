/**
 * MainView — switches the right pane content based on mainView.kind.
 */

import React from "react";
import { Box } from "ink";
import { useAppState } from "../../state/context.js";
import { Dashboard } from "./Dashboard.js";
import { TaskList } from "./TaskList.js";
import { DocViewer } from "./DocViewer.js";
import { SessionViewer } from "./SessionViewer.js";

export function MainView() {
  const { mainView } = useAppState();

  return (
    <Box flexDirection="column" flexGrow={1}>
      {mainView.kind === "dashboard" && <Dashboard />}
      {mainView.kind === "tasks" && <TaskList />}
      {mainView.kind === "doc_viewer" && <DocViewer docType={mainView.docType} />}
      {mainView.kind === "session_viewer" && (
        <SessionViewer sessionId={mainView.sessionId} live={mainView.live} />
      )}
    </Box>
  );
}
