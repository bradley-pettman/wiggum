/**
 * Types for on-disk configuration.
 *
 * A .wiggum/ directory in a project root holds all the config files
 * for a Ralph loop targeting that project.
 *
 * .wiggum/
 * ├── config.yaml          # Loop configuration (serialized WiggumConfig)
 * ├── SPEC.md              # Requirements / PRD
 * ├── PLAN.md              # Implementation plan with tasks
 * ├── PROMPT.md            # Prompt template
 * ├── BACKPRESSURE.md      # Optional agent-facing backpressure context
 * └── sessions/            # Session logs
 *     ├── session-001/
 *     │   └── transcript.jsonl
 *     └── session-002/
 *         └── transcript.jsonl
 */

import type { LoopMode, BackpressureTrigger } from "./loop.js";

// ---------------------------------------------------------------------------
// config.yaml schema
// ---------------------------------------------------------------------------

/** The shape of .wiggum/config.yaml on disk. */
export interface WiggumConfig {
  /** Human-readable loop name. */
  name: string;
  loop: {
    mode: LoopMode;
    maxIterations?: number;
    budgetUsd?: number;
    model: string;
  };
  backpressure: {
    checks: Array<{
      name: string;
      command: string;
      trigger: BackpressureTrigger;
    }>;
  };
}

// ---------------------------------------------------------------------------
// PLAN.md frontmatter schema
// ---------------------------------------------------------------------------

/**
 * Tasks in PLAN.md are stored as a markdown checklist with YAML frontmatter
 * for structured metadata:
 *
 * ```markdown
 * ---
 * id: task-001
 * priority: 1
 * dependencies: []
 * ---
 * - [ ] Implement user authentication
 *   Description of what needs to happen...
 * ```
 */
export interface TaskFrontmatter {
  id: string;
  priority: number;
  dependencies: string[];
}

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------

/** Well-known file paths within the .wiggum directory. */
export const WIGGUM_DIR = ".wiggum";
export const WIGGUM_PATHS = {
  config: `${WIGGUM_DIR}/config.yaml`,
  spec: `${WIGGUM_DIR}/SPEC.md`,
  plan: `${WIGGUM_DIR}/PLAN.md`,
  prompt: `${WIGGUM_DIR}/PROMPT.md`,
  backpressure: `${WIGGUM_DIR}/BACKPRESSURE.md`,
  sessions: `${WIGGUM_DIR}/sessions`,
} as const;
