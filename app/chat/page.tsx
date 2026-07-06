"use client";

import { useChat } from "@ai-sdk/react";
import type { ToolUIPart } from "ai";
import { useState } from "react";
import { ReasoningBlock } from "@/components/reasoning-block";
import { ToolCard } from "@/components/tool-card";

export default function ChatPage() {
  const { messages, sendMessage, status, stop, regenerate, error } = useChat();
  const [input, setInput] = useState("");
  const isBusy = status === "submitted" || status === "streaming";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Streaming Chat with Tools
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          <code className="font-mono">useChat</code> +{" "}
          <code className="font-mono">streamText</code> with multi-step tool
          calling. Try: &ldquo;What&rsquo;s the weather in Tokyo and what time
          is it there?&rdquo;
        </p>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-xl p-4 ${
              message.role === "user"
                ? "ml-12 bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                : "mr-12 border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            }`}
          >
            {message.parts.map((part, i) => {
              const key = `${message.id}-${i}`;
              if (part.type === "text") {
                return (
                  <p key={key} className="whitespace-pre-wrap text-sm">
                    {part.text}
                  </p>
                );
              }
              if (part.type === "reasoning") {
                return <ReasoningBlock key={key} part={part} />;
              }
              if (part.type.startsWith("tool-")) {
                return <ToolCard key={key} part={part as ToolUIPart} />;
              }
              return null;
            })}
          </div>
        ))}

        {status === "submitted" && (
          <div className="mr-12 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <span className="animate-pulse font-mono text-xs text-zinc-500">
              💭 thinking…
            </span>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error.message}
            <button
              onClick={() => regenerate()}
              className="ml-3 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim() || isBusy) return;
          sendMessage({ text: input });
          setInput("");
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the weather or time anywhere…"
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
        {isBusy ? (
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
            disabled={!input.trim()}
            className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}
