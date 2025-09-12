// refine-customer-notes.ts
'use server';

/**
 * @fileOverview AI flow to refine customer notes, highlighting key details and correcting errors.
 *
 * - refineCustomerNotes - An asynchronous function that takes customer notes as input and returns refined notes.
 * - RefineCustomerNotesInput - The input type for the refineCustomerNotes function.
 * - RefineCustomerNotesOutput - The output type for the refineCustomerNotes function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the input schema for customer notes refinement.
const RefineCustomerNotesInputSchema = z.object({
  notes: z
    .string()
    .describe('The original customer notes that need to be refined.'),
});

export type RefineCustomerNotesInput = z.infer<typeof RefineCustomerNotesInputSchema>;

// Define the output schema for the refined customer notes.
const RefineCustomerNotesOutputSchema = z.object({
  refinedNotes: z
    .string()
    .describe(
      'The refined customer notes with highlighted important details and corrected errors.'
    ),
});

export type RefineCustomerNotesOutput = z.infer<typeof RefineCustomerNotesOutputSchema>;

// Exported function to refine customer notes using the AI flow.
export async function refineCustomerNotes(
  input: RefineCustomerNotesInput
): Promise<RefineCustomerNotesOutput> {
  return refineCustomerNotesFlow(input);
}

// Define the prompt for refining customer notes.
const refineCustomerNotesPrompt = ai.definePrompt({
  name: 'refineCustomerNotesPrompt',
  input: { schema: RefineCustomerNotesInputSchema },
  output: { schema: RefineCustomerNotesOutputSchema },
  prompt: `You are an AI assistant that refines customer notes.

        Your goal is to highlight important details and correct any errors in the notes.

        Original Notes: {{{notes}}}

        Refined Notes:`,
});

// Define the Genkit flow for refining customer notes.
const refineCustomerNotesFlow = ai.defineFlow(
  {
    name: 'refineCustomerNotesFlow',
    inputSchema: RefineCustomerNotesInputSchema,
    outputSchema: RefineCustomerNotesOutputSchema,
  },
  async input => {
    const { output } = await refineCustomerNotesPrompt(input);
    return output!;
  }
);
