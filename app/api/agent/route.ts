import { isStepCount, tool, ToolLoopAgent } from "ai";
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
  const { prompt }: { prompt: string } = await req.json();

  const result = await agent.generate({ prompt });

  // Flatten the agent loop into a step-by-step trace for the UI.
  const steps = result.steps.map((step) => ({
    text: step.text,
    toolCalls: step.toolCalls.map((call) => ({
      toolName: call.toolName,
      input: call.input,
    })),
    toolResults: step.toolResults.map((toolResult) => ({
      toolName: toolResult.toolName,
      output: toolResult.output,
    })),
  }));

  return Response.json({
    text: result.text,
    steps,
    usage: result.usage,
  });
}
