/**
 * A tiny document corpus for the semantic-search demo. Each entry is embedded
 * once (lazily, on first search) and compared against query embeddings with
 * cosine similarity.
 */
export const corpus = [
  "streamText streams language model output token by token, ideal for chat interfaces.",
  "generateText produces a complete response in one call, useful for agents and background jobs.",
  "The useChat hook manages message state, streaming, and status for React chat UIs.",
  "Tool calling lets the model invoke typed functions you define with zod input schemas.",
  "The AI Gateway routes requests to 100+ models across providers with a single API key.",
  "Embeddings turn text into vectors so you can rank documents by semantic similarity.",
  "structured output constrains model responses to a zod schema instead of free-form text.",
  "ToolLoopAgent runs a model in a loop, executing tools until the task is complete.",
  "The useCompletion hook streams a single text completion for autocomplete-style UIs.",
  "cosineSimilarity measures how close two embedding vectors are, from -1 to 1.",
  "Multi-step generation lets the model call a tool, read the result, and keep reasoning.",
  "convertToModelMessages transforms UI messages from useChat into model messages for the server.",
  "The useObject hook streams partial JSON objects to the client as they are generated.",
  "Model Context Protocol (MCP) servers expose external tools that agents can discover at runtime.",
  "stopWhen with isStepCount bounds how many tool-calling steps an agent may take.",
  "Provider strings like anthropic/claude-sonnet-4.5 pick a model through the gateway with one line.",
];
