import { cosineSimilarity, embed, embedMany } from "ai";
import { corpus } from "@/lib/corpus";
import { EMBEDDING_MODEL } from "@/lib/models";

export const maxDuration = 30;

// Embed the corpus once per server instance and reuse it across requests.
let corpusEmbeddings: Promise<number[][]> | null = null;

function getCorpusEmbeddings(): Promise<number[][]> {
  corpusEmbeddings ??= embedMany({
    model: EMBEDDING_MODEL,
    values: corpus,
  }).then(({ embeddings }) => embeddings);
  return corpusEmbeddings;
}

export async function POST(req: Request) {
  const { query }: { query: string } = await req.json();

  if (!query?.trim()) {
    return Response.json({ error: "Query is required" }, { status: 400 });
  }

  const [documents, { embedding: queryEmbedding }] = await Promise.all([
    getCorpusEmbeddings().catch((error) => {
      // Drop the cache so a transient failure doesn't poison future requests.
      corpusEmbeddings = null;
      throw error;
    }),
    embed({ model: EMBEDDING_MODEL, value: query }),
  ]);

  const results = documents
    .map((embedding, i) => ({
      document: corpus[i],
      score: cosineSimilarity(queryEmbedding, embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return Response.json({ results });
}
