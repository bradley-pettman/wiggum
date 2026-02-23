/**
 * Types for the `claude -p --output-format stream-json` NDJSON protocol.
 *
 * Each line emitted by the CLI is one of these message types.
 * The discriminant is the `type` field (and `subtype` for system/result).
 */

// ---------------------------------------------------------------------------
// Content blocks (shared by assistant and user messages)
// ---------------------------------------------------------------------------

export interface TextBlock {
  type: "text";
  text: string;
}

export interface ThinkingBlock {
  type: "thinking";
  thinking: string;
}

export interface ToolUseBlock {
  type: "tool_use";
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface ToolResultBlock {
  type: "tool_result";
  tool_use_id: string;
  content: string | Array<{ type: string; [key: string]: unknown }>;
}

export type AssistantContentBlock = TextBlock | ThinkingBlock | ToolUseBlock;
export type UserContentBlock = ToolResultBlock | TextBlock;

// ---------------------------------------------------------------------------
// Per-message token usage (from the Anthropic API)
// ---------------------------------------------------------------------------

export interface MessageUsage {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens?: number;
  cache_read_input_tokens?: number;
}

// ---------------------------------------------------------------------------
// SDKMessage union — one per NDJSON line
// ---------------------------------------------------------------------------

/** First line: session init. */
export interface CLISystemInitMessage {
  type: "system";
  subtype: "init";
  uuid: string;
  session_id: string;
  cwd: string;
  model: string;
  tools: string[];
  mcp_servers: Array<{ name: string; status: string }>;
  permissionMode: string;
  apiKeySource: string;
}

/** Emitted when context is compacted. */
export interface CLICompactBoundaryMessage {
  type: "system";
  subtype: "compact_boundary";
  uuid: string;
  session_id: string;
  compact_metadata: {
    trigger: "manual" | "auto";
    pre_tokens: number;
  };
}

export type CLISystemMessage = CLISystemInitMessage | CLICompactBoundaryMessage;

/** A complete assistant turn (text and/or tool use). */
export interface CLIAssistantMessage {
  type: "assistant";
  uuid: string;
  session_id: string;
  message: {
    id: string;
    type: "message";
    role: "assistant";
    model: string;
    content: AssistantContentBlock[];
    stop_reason: "end_turn" | "tool_use" | "max_tokens" | null;
    usage: MessageUsage;
  };
  parent_tool_use_id: string | null;
}

/** Tool results fed back to the model. */
export interface CLIUserMessage {
  type: "user";
  uuid?: string;
  session_id: string;
  message: {
    role: "user";
    content: UserContentBlock[];
  };
  parent_tool_use_id: string | null;
}

/** Per-model usage breakdown in the result message. */
export interface ModelUsageEntry {
  inputTokens: number;
  outputTokens: number;
  cacheReadInputTokens: number;
  cacheCreationInputTokens: number;
  webSearchRequests: number;
  costUSD: number;
  contextWindow: number;
}

/** Successful result. */
export interface CLIResultSuccess {
  type: "result";
  subtype: "success";
  uuid: string;
  session_id: string;
  is_error: false;
  duration_ms: number;
  duration_api_ms: number;
  num_turns: number;
  result: string;
  total_cost_usd: number;
  usage: Required<MessageUsage>;
  modelUsage: Record<string, ModelUsageEntry>;
}

/** Error result (max turns, budget exceeded, execution error, etc.). */
export interface CLIResultError {
  type: "result";
  subtype:
    | "error_max_turns"
    | "error_during_execution"
    | "error_max_budget_usd";
  uuid: string;
  session_id: string;
  is_error: true;
  duration_ms: number;
  duration_api_ms: number;
  num_turns: number;
  total_cost_usd: number;
  usage: Required<MessageUsage>;
  modelUsage: Record<string, ModelUsageEntry>;
  errors: string[];
}

export type CLIResultMessage = CLIResultSuccess | CLIResultError;

/**
 * The top-level union: every NDJSON line from
 * `claude -p --output-format stream-json` is one of these.
 */
export type CLIStreamMessage =
  | CLISystemMessage
  | CLIAssistantMessage
  | CLIUserMessage
  | CLIResultMessage;
