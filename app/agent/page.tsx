"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type ToolUIPart } from "ai";
import { useState } from "react";
import { ReasoningBlock } from "@/components/reasoning-block";
import { ToolCard } from "@/components/tool-card";

const EXAMPLE_PROMPT =
  "Roll 4 dice, then multiply the sum of the rolls by 17 and subtract 3.";

export default function AgentPage() {
  const [prompt, setPrompt] = useState(EXAMPLE_PROMPT);
  const { messages, sendMessage, setMessages, status, stop, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/agent" }),
  });
  const isRunning = status === "submitted" || status === "streaming";

  const assistantMessage = messages.findLast((m) => m.role === "assistant");
  // Number the step-start boundaries so the trace reads as a timeline.
  let stepNumber = 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Agent Loop</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          A <code className="font-mono">ToolLoopAgent</code> with calculator
          and dice tools, streamed live via{" "}
          <code className="font-mono">createAgentUIStreamResponse</code> —
          reasoning, tool calls, and results appear as they happen.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!prompt.trim() || isRunning) return;
          setMessages([]); // fresh run each time
          sendMessage({ text: prompt });
        }}
        className="space-y-2"
      >
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
        {isRunning ? (
          <button
            type="button"
            onClick={() => stop()}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium dark:border-zinc-700"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!prompt.trim()}
            className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
          >
            Run agent
          </button>
        )}
      </form>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error.message}
        </div>
      )}

      {status === "submitted" && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <span className="animate-pulse font-mono text-xs text-zinc-500">
            💭 thinking…
          </span>
        </div>
      )}

      {assistantMessage && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          {assistantMessage.parts.map((part, i) => {
            const key = `${assistantMessage.id}-${i}`;
            if (part.type === "step-start") {
              stepNumber++;
              return (
                <div
                  key={key}
                  className="mt-3 flex items-center gap-2 first:mt-0"
                >
                  <span className="font-mono text-xs text-zinc-400">
                    step {stepNumber}
                  </span>
                  <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                </div>
              );
            }
            if (part.type === "reasoning") {
              return <ReasoningBlock key={key} part={part} />;
            }
            if (part.type.startsWith("tool-")) {
              return <ToolCard key={key} part={part as ToolUIPart} />;
            }
            if (part.type === "text") {
              return (
                <p key={key} className="my-2 whitespace-pre-wrap text-sm">
                  {part.text}
                </p>
              );
            }
            return null;
          })}

          {status === "ready" && (
            <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 font-mono text-xs text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400">
              ✓ agent finished
            </div>
          )}
        </div>
      )}
    </div>
  );
}
