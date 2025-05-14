'use server';

/**
 * @fileOverview A flow for summarizing group savings contributions and upcoming needs using AI.
 *
 * - summarizeGroupSavings - A function that handles the group savings summarization process.
 * - SummarizeGroupSavingsInput - The input type for the summarizeGroupSavings function.
 * - SummarizeGroupSavingsOutput - The return type for the summarizeGroupSavings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeGroupSavingsInputSchema = z.object({
  groupName: z.string().describe('The name of the Mukando group.'),
  currentSavings: z
    .number()
    .describe('The current total savings of the group in Zimbabwe Dollars.'),
  upcomingNeeds: z.string().describe('Description of upcoming needs or expenses.'),
  contributionAmount: z.number().describe('The standard contribution amount.'),
  contributionFrequency: z
    .string()
    .describe('How often contributions happen (e.g., weekly, monthly).'),
});

export type SummarizeGroupSavingsInput = z.infer<typeof SummarizeGroupSavingsInputSchema>;

const SummarizeGroupSavingsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the group savings status.'),
});

export type SummarizeGroupSavingsOutput = z.infer<typeof SummarizeGroupSavingsOutputSchema>;

export async function summarizeGroupSavings(
  input: SummarizeGroupSavingsInput
): Promise<SummarizeGroupSavingsOutput> {
  return summarizeGroupSavingsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeGroupSavingsPrompt',
  input: {schema: SummarizeGroupSavingsInputSchema},
  output: {schema: SummarizeGroupSavingsOutputSchema},
  prompt: `You are a helpful assistant that summarizes Mukando group savings information for group admins.

  Group Name: {{{groupName}}}
  Current Savings (ZWL): {{{currentSavings}}}
  Upcoming Needs: {{{upcomingNeeds}}}
  Contribution Amount (ZWL): {{{contributionAmount}}}
  Contribution Frequency: {{{contributionFrequency}}}

  Please provide a concise and clear summary of the group's current savings status, highlighting upcoming needs and contribution details, in a way that is easy for all group members to understand.
  Ensure the summary is no more than 200 words.
  `,
});

const summarizeGroupSavingsFlow = ai.defineFlow(
  {
    name: 'summarizeGroupSavingsFlow',
    inputSchema: SummarizeGroupSavingsInputSchema,
    outputSchema: SummarizeGroupSavingsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
