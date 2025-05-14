// src/ai/flows/financial-health-chatbot.ts
'use server';
/**
 * @fileOverview A multilingual AI chatbot for financial and health literacy.
 *
 * - financialHealthChatbot - A function that handles chatbot interactions.
 * - FinancialHealthChatbotInput - The input type for the financialHealthChatbot function.
 * - FinancialHealthChatbotOutput - The return type for the financialHealthChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FinancialHealthChatbotInputSchema = z.object({
  language: z.enum(['en', 'sn', 'nd']).describe('The language to use for the chatbot interaction (en: English, sn: Shona, nd: Ndebele).'),
  userInput: z.string().describe('The user input to the chatbot.'),
});
export type FinancialHealthChatbotInput = z.infer<typeof FinancialHealthChatbotInputSchema>;

const FinancialHealthChatbotOutputSchema = z.object({
  chatbotResponse: z.string().describe('The chatbot response to the user input in the specified language.'),
});
export type FinancialHealthChatbotOutput = z.infer<typeof FinancialHealthChatbotOutputSchema>;

export async function financialHealthChatbot(input: FinancialHealthChatbotInput): Promise<FinancialHealthChatbotOutput> {
  return financialHealthChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'financialHealthChatbotPrompt',
  input: {schema: FinancialHealthChatbotInputSchema},
  output: {schema: FinancialHealthChatbotOutputSchema},
  prompt: `You are a multilingual AI chatbot designed to provide financial literacy, health tips, and information about group savings (Mukando/Round) to users in Zimbabwe. You can respond in Shona, Ndebele, or English based on the user's language preference.

  User Input (Language: {{{language}}}):
  {{userInput}}

  Chatbot Response:
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_CIVIC_INTEGRITY',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const financialHealthChatbotFlow = ai.defineFlow(
  {
    name: 'financialHealthChatbotFlow',
    inputSchema: FinancialHealthChatbotInputSchema,
    outputSchema: FinancialHealthChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
