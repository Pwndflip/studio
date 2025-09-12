'use server';

import { refineCustomerNotes } from '@/ai/flows/refine-customer-notes';

export async function refineNotesAction(currentNotes: string) {
  try {
    if (!currentNotes.trim()) {
      return { refinedNotes: '', error: 'Notes are empty.' };
    }
    const result = await refineCustomerNotes({ notes: currentNotes });
    return { refinedNotes: result.refinedNotes, error: null };
  } catch (e) {
    console.error(e);
    return {
      refinedNotes: currentNotes,
      error: 'Failed to refine notes. Please try again.',
    };
  }
}
