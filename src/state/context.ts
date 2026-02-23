/**
 * React contexts and hooks for accessing app state and dispatch.
 */

import { createContext, useContext } from "react";
import type { AppState, AppAction } from "../types/tui.js";

export const AppStateContext = createContext<AppState | null>(null);
export const AppDispatchContext = createContext<React.Dispatch<AppAction> | null>(null);

export function useAppState(): AppState {
  const state = useContext(AppStateContext);
  if (!state) throw new Error("useAppState must be used within AppStateContext.Provider");
  return state;
}

export function useAppDispatch(): React.Dispatch<AppAction> {
  const dispatch = useContext(AppDispatchContext);
  if (!dispatch)
    throw new Error("useAppDispatch must be used within AppDispatchContext.Provider");
  return dispatch;
}
