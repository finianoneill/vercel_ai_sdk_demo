import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  tool,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { CHAT_MODEL } from "@/lib/models";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: CHAT_MODEL,
    instructions:
      "You are a friendly assistant demonstrating the Vercel AI SDK. " +
      "Use the available tools when they help answer the question, and " +
      "explain the results conversationally.",
    messages: await convertToModelMessages(messages),
    // Allow the model to call tools, read the results, and keep going.
    stopWhen: isStepCount(5),
    // Enable Claude's extended thinking so reasoning streams to the client
    // (toUIMessageStream forwards reasoning parts by default).
    providerOptions: {
      anthropic: {
        thinking: { type: "enabled", budgetTokens: 4096 },
      },
    },
    tools: {
      getWeather: tool({
        description: "Get the current weather for a city (mock data)",
        inputSchema: z.object({
          city: z.string().describe("The city to get the weather for"),
          unit: z.enum(["C", "F"]).describe("Temperature unit"),
        }),
        execute: async ({ city, unit }) => {
          const conditions = ["Sunny", "Cloudy", "Rainy", "Windy", "Snowy"];
          const temperature =
            unit === "C"
              ? Math.round(Math.random() * 35)
              : Math.round(Math.random() * 63 + 32);
          return {
            city,
            unit,
            temperature,
            condition: conditions[Math.floor(Math.random() * conditions.length)],
          };
        },
      }),
      getLocalTime: tool({
        description: "Get the current local time in an IANA time zone",
        inputSchema: z.object({
          timeZone: z
            .string()
            .describe('IANA time zone, e.g. "America/New_York"'),
        }),
        execute: async ({ timeZone }) => {
          try {
            const time = new Intl.DateTimeFormat("en-US", {
              timeZone,
              dateStyle: "full",
              timeStyle: "short",
            }).format(new Date());
            return { timeZone, time };
          } catch {
            return { timeZone, error: "Unknown time zone" };
          }
        },
      }),
    },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
