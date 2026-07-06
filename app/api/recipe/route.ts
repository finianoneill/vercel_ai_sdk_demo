import { createTextStreamResponse, Output, streamText, toTextStream } from "ai";
import { CHAT_MODEL } from "@/lib/models";
import { recipeSchema } from "@/lib/schemas";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { dish }: { dish: string } = await req.json();

  const result = streamText({
    model: CHAT_MODEL,
    // Constrain the output to the shared zod schema; the client's useObject
    // hook parses the partial JSON as it streams in.
    output: Output.object({ schema: recipeSchema }),
    prompt: `Generate a recipe for: ${dish}`,
  });

  return createTextStreamResponse({
    stream: toTextStream({ stream: result.stream }),
  });
}
