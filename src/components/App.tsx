/**
 * Root component — sets up reducer, context providers, layout, and global input.
 */

import React, { useReducer } from "react";
import { Box } from "ink";
import { appReducer, createInitialState } from "../state/reducer.js";
import { AppStateContext, AppDispatchContext } from "../state/context.js";
import { MOCK_LOOP, MOCK_SESSIONS } from "../state/mock-data.js";
import { useGlobalInput } from "../hooks/use-global-input.js";
import { useTerminalSize } from "../hooks/use-terminal-size.js";
import { Panel } from "./Panel.js";
import { CommandBar } from "./CommandBar.js";
import { LoopStatusContent } from "./left/LoopStatusContent.js";
import { DocsContent } from "./left/DocsContent.js";
import { SessionsContent } from "./left/SessionsContent.js";
import { MainView } from "./main/MainView.js";
import { Logo } from "./Logo.js";

function AppInner() {
  const [state, dispatch] = useReducer(
    appReducer,
    { loop: MOCK_LOOP, sessions: MOCK_SESSIONS },
    ({ loop, sessions }) => createInitialState(loop, sessions),
  );

  const { columns, rows } = useTerminalSize();
  useGlobalInput(state, dispatch);

  // Layout: left column (~30 chars) + main view (rest)
  const leftWidth = Math.min(40, Math.floor(columns * 0.35));
  const mainHeight = rows - 2; // reserve 2 rows for command bar

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        <Box flexDirection="column" height={rows}>
          {/* Main layout */}
          <Box flexDirection="row" height={mainHeight}>
            {/* Left panels stacked vertically */}
            <Box flexDirection="column" width={leftWidth}>
              <Logo />
              <Panel panelId="loop_status" isFocused={state.activePanel === "loop_status"}>
                <LoopStatusContent />
              </Panel>
              <Panel panelId="docs" isFocused={state.activePanel === "docs"}>
                <DocsContent />
              </Panel>
              <Panel panelId="sessions" isFocused={state.activePanel === "sessions"}>
                <SessionsContent />
              </Panel>
            </Box>

            {/* Main view */}
            <Box
              flexDirection="column"
              flexGrow={1}
              borderStyle="round"
              borderColor="gray"
              paddingLeft={1}
              paddingRight={1}
            >
              <MainView />
            </Box>
          </Box>

          {/* Command bar */}
          <CommandBar />
        </Box>
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export function App() {
  return <AppInner />;
}
