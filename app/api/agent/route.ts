import {
  createAgentUIStreamResponse,
  isStepCount,
  tool,
  ToolLoopAgent,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { CHAT_MODEL } from "@/lib/models";
import { evaluateExpression } from "@/lib/calculator";

export const maxDuration = 60;

const agent = new ToolLoopAgent({
  model: CHAT_MODEL,
  instructions:
    "You are a problem-solving agent. Break the task into steps and use your " +
    "tools for every calculation or random value — never compute them yourself. " +
    "When you are done, summarize what you did.",
  stopWhen: isStepCount(8),
  // Extended thinking streams reasoning parts to the client between steps.
  providerOptions: {
    anthropic: {
      thinking: { type: "enabled", budgetTokens: 4096 },
    },
  },
  tools: {
    calculate: tool({
      description:
        "Evaluate an arithmetic expression with + - * / ^ and parentheses",
      inputSchema: z.object({
        expression: z.string().describe('An expression like "(3 + 4) * 12"'),
      }),
      execute: async ({ expression }) => {
        try {
          return { expression, result: evaluateExpression(expression) };
        } catch (error) {
          return {
            expression,
            error: error instanceof Error ? error.message : "Invalid expression",
          };
        }
      },
    }),
    rollDice: tool({
      description: "Roll N six-sided dice and return the individual results",
      inputSchema: z.object({
        count: z.number().int().min(1).max(20).describe("Number of dice"),
      }),
      execute: async ({ count }) => {
        const rolls = Array.from(
          { length: count },
          () => Math.floor(Math.random() * 6) + 1,
        );
        return { rolls };
      },
    }),
  },
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Runs the agent loop and streams reasoning, tool calls, and text live.
  return createAgentUIStreamResponse({
    agent,
    uiMessages: messages,
  });
}
