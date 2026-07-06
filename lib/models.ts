/**
 * Model IDs resolved through the Vercel AI Gateway ("provider/model-id" strings).
 * One AI_GATEWAY_API_KEY gives access to every provider — swap models freely.
 * Override any of these via environment variables without touching code.
 */
export const CHAT_MODEL = process.env.CHAT_MODEL ?? "anthropic/claude-sonnet-4.5";
export const FAST_MODEL = process.env.FAST_MODEL ?? "anthropic/claude-haiku-4.5";
export const EMBEDDING_MODEL =
  process.env.EMBEDDING_MODEL ?? "openai/text-embedding-3-small";
