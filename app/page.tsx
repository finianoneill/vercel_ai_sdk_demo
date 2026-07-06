import Link from "next/link";

const demos = [
  {
    href: "/chat",
    title: "Streaming Chat with Tools",
    description:
      "A chat interface where the model calls typed tools (weather, local time) mid-conversation and streams the results back.",
    apis: ["useChat", "streamText", "tool()", "isStepCount"],
  },
  {
    href: "/completion",
    title: "Text Completion",
    description:
      "Single-shot streaming completion for autocomplete-style UIs — no conversation state.",
    apis: ["useCompletion", "streamText"],
  },
  {
    href: "/structured",
    title: "Structured Output",
    description:
      "Stream a typed JSON object (a recipe) that renders progressively as it is generated, constrained by a zod schema.",
    apis: ["useObject", "Output.object", "zod"],
  },
  {
    href: "/embeddings",
    title: "Semantic Search",
    description:
      "Embed a query and rank a document corpus by cosine similarity — the building block of RAG.",
    apis: ["embed", "embedMany", "cosineSimilarity"],
  },
  {
    href: "/agent",
    title: "Agent Loop",
    description:
      "A ToolLoopAgent that plans, calls tools across multiple steps, and returns a full execution trace.",
    apis: ["ToolLoopAgent", "generate", "steps"],
  },
];

export default function Home() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          Vercel AI SDK Demo
        </h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
          A tour of AI SDK 7 in Next.js App Router. Every demo pairs a client
          page with an API route, and all models are resolved through the
          Vercel AI Gateway — set{" "}
          <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-sm dark:bg-zinc-800">
            AI_GATEWAY_API_KEY
          </code>{" "}
          in <code className="font-mono text-sm">.env.local</code> to run them.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {demos.map((demo) => (
          <Link
            key={demo.href}
            href={demo.href}
            className="group rounded-xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <h2 className="font-semibold group-hover:underline">
              {demo.title}
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {demo.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {demo.apis.map((api) => (
                <span
                  key={api}
                  className="rounded-full bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                >
                  {api}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
