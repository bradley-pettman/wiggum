/**
 * Types for on-disk configuration.
 *
 * A .wiggum/ directory in a project root holds all the config files
 * for a Ralph loop targeting that project.
 *
 * .wiggum/
 * ├── config.yaml          # Loop configuration (serialized WiggumConfig)
 * ├── PLAN.md              # Implementation plan with tasks (references spec)
 * ├── PROMPT.md            # Prompt template
 * ├── BACKPRESSURE.md      # Optional agent-facing backpressure context
 * └── sessions/            # Session logs
 *     ├── session-001/
 *     │   └── transcript.jsonl
 *     └── session-002/
 *         └── transcript.jsonl
 *
 * The spec lives wherever the plan references it — could be in .wiggum/,
 * in the project root, or anywhere else. The plan's frontmatter contains
 * a `spec` field pointing to the spec file path.
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
 * PLAN.md uses YAML frontmatter to declare metadata:
 *
 * ```markdown
 * ---
 * spec: ../SPEC.md
 * ---
 *
 * ## Tasks
 *
 * - [ ] <!-- id:task-001 priority:1 deps: -->
 *   **Implement user authentication**
 *   Description of what needs to happen...
 *
 * - [ ] <!-- id:task-002 priority:2 deps:task-001 -->
 *   **Add session middleware**
 *   ...
 * ```
 */
export interface PlanFrontmatter {
  /** Path to the spec this plan implements (relative to plan file). */
  spec: string;
}

export interface TaskAnnotation {
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
  plan: `${WIGGUM_DIR}/PLAN.md`,
  prompt: `${WIGGUM_DIR}/PROMPT.md`,
  backpressure: `${WIGGUM_DIR}/BACKPRESSURE.md`,
  sessions: `${WIGGUM_DIR}/sessions`,
} as const;
