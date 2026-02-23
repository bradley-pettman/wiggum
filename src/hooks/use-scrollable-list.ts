/**
 * Generic windowing hook for scrollable lists.
 *
 * Given items, a selected index, and a viewport height, returns the
 * visible slice of items and the offset to apply.
 */

import { useMemo } from "react";

export interface ScrollableResult<T> {
  /** The visible items to render. */
  visible: T[];
  /** Index of the first visible item in the full list. */
  startIndex: number;
  /** Whether there are items above the visible window. */
  hasAbove: boolean;
  /** Whether there are items below the visible window. */
  hasBelow: boolean;
}

export function useScrollableList<T>(
  items: T[],
  selectedIndex: number,
  viewportHeight: number,
): ScrollableResult<T> {
  return useMemo(() => {
    if (items.length === 0 || viewportHeight <= 0) {
      return { visible: [], startIndex: 0, hasAbove: false, hasBelow: false };
    }

    const maxStart = Math.max(0, items.length - viewportHeight);
    // Keep selected item in view
    let startIndex = Math.max(0, selectedIndex - Math.floor(viewportHeight / 2));
    startIndex = Math.min(startIndex, maxStart);

    const endIndex = Math.min(startIndex + viewportHeight, items.length);
    const visible = items.slice(startIndex, endIndex);

    return {
      visible,
      startIndex,
      hasAbove: startIndex > 0,
      hasBelow: endIndex < items.length,
    };
  }, [items, selectedIndex, viewportHeight]);
}
