'use server';

import { z } from 'zod';
import { generateSeoContent, type GenerateSeoContentInput, type GenerateSeoContentOutput } from "@/ai/flows/seo-content-generator";

const actionInputSchema = z.object({
  pageContent: z.string(),
  targetKeywords: z.array(z.string()),
  location: z.string(),
});

type ActionResponse = {
  success: boolean;
  data?: GenerateSeoContentOutput;
  error?: string;
};

export async function generateSeoContentAction(input: GenerateSeoContentInput): Promise<ActionResponse> {
  const validatedInput = actionInputSchema.safeParse(input);

  if (!validatedInput.success) {
    return { success: false, error: "Invalid input." };
  }

  try {
    const output = await generateSeoContent(validatedInput.data);
    return { success: true, data: output };
  } catch (error) {
    console.error("Error generating SEO content:", error);
    return { success: false, error: "An unexpected error occurred." };
  }
}
