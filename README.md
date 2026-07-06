# Vercel AI SDK Demo

A Next.js App Router application that tours the [Vercel AI SDK](https://ai-sdk.dev) (v7). Each demo pairs a client page with an API route so you can read both halves of every pattern side by side.

## Demos

| Route | What it shows | Key APIs |
| --- | --- | --- |
| `/chat` | Streaming chat with multi-step tool calling and generative UI for tool results | `useChat`, `streamText`, `tool()`, `isStepCount`, `createUIMessageStreamResponse` |
| `/completion` | One-shot streaming text completion | `useCompletion`, `streamText` |
| `/structured` | A typed JSON recipe streamed and rendered progressively | `useObject`, `Output.object`, shared zod schema |
| `/embeddings` | Semantic search over a small corpus (the building block of RAG) | `embed`, `embedMany`, `cosineSimilarity` |
| `/agent` | An agent that loops over tools and returns its execution trace | `ToolLoopAgent`, `generate`, `steps` |

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` from the example and add your [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) key:

   ```bash
   cp .env.example .env.local
   ```

   The gateway resolves `"provider/model-id"` strings (e.g. `anthropic/claude-sonnet-4.5`) so a single key covers every provider, including the OpenAI embedding model used by the search demo.

3. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Swapping models

Model IDs live in [`lib/models.ts`](lib/models.ts) and can be overridden with the `CHAT_MODEL`, `FAST_MODEL`, and `EMBEDDING_MODEL` environment variables — any gateway-supported model works with no code changes.

To use a provider directly instead of the gateway (e.g. with an `ANTHROPIC_API_KEY`), install the provider package and swap the string for a provider instance:

```bash
npm install @ai-sdk/anthropic
```

```ts
import { anthropic } from "@ai-sdk/anthropic";

streamText({ model: anthropic("claude-sonnet-4-5"), /* ... */ });
```

## Project structure

```
app/
  api/
    chat/route.ts        # streamText + tools → UI message stream
    completion/route.ts  # streamText → UI message stream (data protocol)
    recipe/route.ts      # streamText + Output.object → text stream of JSON
    search/route.ts      # embedMany (cached) + embed + cosineSimilarity
    agent/route.ts       # ToolLoopAgent.generate → JSON trace
  chat/page.tsx          # useChat with tool part rendering
  completion/page.tsx    # useCompletion
  structured/page.tsx    # useObject with progressive rendering
  embeddings/page.tsx    # fetch-based search UI
  agent/page.tsx         # step-by-step agent trace UI
lib/
  models.ts              # gateway model IDs (env-overridable)
  schemas.ts             # zod schema shared by server route and client hook
  corpus.ts              # documents for the embedding demo
  calculator.ts          # safe arithmetic evaluator for the agent tool
```

## Notes

- AI SDK 7 requires Node.js 22+.
- Tool-result parts arrive on the client as `message.parts` entries typed `tool-<name>` with a `state` of `input-streaming` → `input-available` → `output-available` (or `output-error`).
- The corpus embeddings in the search demo are computed once per server instance and reused across requests.
