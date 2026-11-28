import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const artikels = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/artikels" }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    category: z.enum(["rus", "liefde", "beweeg", "gesondheid"]),
    date: z.coerce.date(),
    summary: z.string(),
    image: z.string().optional().default(""),
    imageAlt: z.string().optional().default(""),
    leestyd: z.number().optional(),
    omslag: z.string().optional(),
    kortliks: z.array(z.string()).optional().default([]),
    bronne: z
      .array(z.object({ titel: z.string(), url: z.string().url() }))
      .min(1, "Elke artikel moet ten minste een bron hê."),
    nagegaan: z.coerce.date().optional(),
    cta: z.enum(["kontrole", "toets"]).optional().default("kontrole"),
    leesVerder: z.string().optional(),
  }),
});

export const collections = { artikels };
