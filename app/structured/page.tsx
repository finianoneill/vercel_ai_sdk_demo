"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { useState } from "react";
import { recipeSchema } from "@/lib/schemas";

export default function StructuredPage() {
  const [dish, setDish] = useState("");
  const { object, submit, isLoading, error, stop } = useObject({
    api: "/api/recipe",
    schema: recipeSchema,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Structured Output
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          <code className="font-mono">useObject</code> +{" "}
          <code className="font-mono">Output.object</code> stream a typed JSON
          object that renders progressively — watch the recipe fill in as it
          generates.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!dish.trim() || isLoading) return;
          submit({ dish });
        }}
        className="flex gap-2"
      >
        <input
          value={dish}
          onChange={(e) => setDish(e.target.value)}
          placeholder="Mushroom risotto…"
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
        {isLoading ? (
          <button
            type="button"
            onClick={stop}
            className="rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium dark:border-zinc-700"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!dish.trim()}
            className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
          >
            Generate recipe
          </button>
        )}
      </form>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error.message}
        </div>
      )}

      {object && (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">{object.name}</h2>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {object.description}
              </p>
            </div>
            <div className="flex shrink-0 gap-2 text-xs">
              {object.difficulty && (
                <span className="rounded-full bg-amber-100 px-2.5 py-1 font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  {object.difficulty}
                </span>
              )}
              {object.prepMinutes != null && (
                <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {object.prepMinutes} min
                </span>
              )}
            </div>
          </div>

          {object.ingredients && object.ingredients.length > 0 && (
            <div className="mt-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Ingredients
              </h3>
              <ul className="mt-2 space-y-1 text-sm">
                {object.ingredients.map((ingredient, i) => (
                  <li key={i} className="flex justify-between gap-4">
                    <span>{ingredient?.item}</span>
                    <span className="text-zinc-500">{ingredient?.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {object.steps && object.steps.length > 0 && (
            <div className="mt-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                Steps
              </h3>
              <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm">
                {object.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
