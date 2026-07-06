import { createUIMessageStreamResponse, streamText, toUIMessageStream } from "ai";
import { FAST_MODEL } from "@/lib/models";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  const result = streamText({
    model: FAST_MODEL,
    instructions:
      "You are a concise writing assistant. Continue or answer the prompt directly, without preamble.",
    prompt,
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
