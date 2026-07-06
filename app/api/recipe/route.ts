import {
  createUIMessageStreamResponse,
  Output,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { CHAT_MODEL } from "@/lib/models";
import { recipeSchema } from "@/lib/schemas";

export const maxDuration = 60;

export async function POST(req: Request) {
  // UI message stream protocol (instead of a raw text stream) so reasoning
  // parts travel alongside the structured JSON output.
  const { messages }: { messages: UIMessage[] } = await req.json();

  const lastUserMessage = messages.findLast((m) => m.role === "user");
  const dish = lastUserMessage?.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("");

  if (!dish?.trim()) {
    return Response.json({ error: "Dish is required" }, { status: 400 });
  }

  const result = streamText({
    model: CHAT_MODEL,
    // Constrain the output to the shared zod schema; the client parses the
    // partial JSON from the streamed text parts as it arrives.
    output: Output.object({ schema: recipeSchema }),
    providerOptions: {
      anthropic: {
        thinking: { type: "enabled", budgetTokens: 4096 },
      },
    },
    prompt: `Generate a recipe for: ${dish}`,
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
