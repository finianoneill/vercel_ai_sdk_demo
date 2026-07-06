import { z } from "zod";

/**
 * Shared between the /api/recipe route (server) and the useObject hook (client)
 * so both sides agree on the shape of the streamed object.
 */
export const recipeSchema = z.object({
  name: z.string().describe("Name of the recipe"),
  description: z.string().describe("One-sentence description of the dish"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  prepMinutes: z.number().describe("Preparation time in minutes"),
  ingredients: z.array(
    z.object({
      item: z.string(),
      amount: z.string().describe('Quantity, e.g. "2 cups"'),
    }),
  ),
  steps: z.array(z.string()).describe("Ordered cooking steps"),
});

export type Recipe = z.infer<typeof recipeSchema>;
