'use server';
/**
 * @fileOverview An AI agent that generates SEO-optimized content (meta descriptions, title tags, and structured schema).
 *
 * - generateSeoContent - A function that handles the SEO content generation process.
 * - GenerateSeoContentInput - The input type for the generateSeoContent function.
 * - GenerateSeoContentOutput - The return type for the generateSeoContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSeoContentInputSchema = z.object({
  pageContent: z.string().describe('The main content of the web page from Sanity CMS.'),
  targetKeywords: z.array(z.string()).describe('A list of target keywords for SEO optimization.'),
  location: z.string().describe('The geographical location to optimize for (e.g., Mahishadal, West Bengal, India).'),
});
export type GenerateSeoContentInput = z.infer<typeof GenerateSeoContentInputSchema>;

const GenerateSeoContentOutputSchema = z.object({
  titleTag: z.string().describe('An SEO-optimized title tag for the web page.'),
  metaDescription: z.string().describe('An SEO-optimized meta description for the web page (max 160 characters).'),
  structuredSchema: z.string().describe('JSON-LD structured data schema (e.g., LocalBusiness, MedicalBusiness) as a string.'),
});
export type GenerateSeoContentOutput = z.infer<typeof GenerateSeoContentOutputSchema>;

export async function generateSeoContent(input: GenerateSeoContentInput): Promise<GenerateSeoContentOutput> {
  return seoContentGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'seoContentGeneratorPrompt',
  input: {schema: GenerateSeoContentInputSchema},
  output: {schema: GenerateSeoContentOutputSchema},
  prompt: `You are an expert SEO specialist for a medical practice, tasked with generating SEO-optimized content for a doctor's website.

Based on the provided 'pageContent', 'targetKeywords', and 'location', generate a compelling 'titleTag', a concise 'metaDescription' (max 160 characters), and appropriate 'structuredSchema' (JSON-LD) for a healthcare business.

Focus on local SEO for the given location and incorporate the target keywords naturally.

Page Content: {{{pageContent}}}
Target Keywords: {{{targetKeywords}}}
Location: {{{location}}}`,
});

const seoContentGeneratorFlow = ai.defineFlow(
  {
    name: 'seoContentGeneratorFlow',
    inputSchema: GenerateSeoContentInputSchema,
    outputSchema: GenerateSeoContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
