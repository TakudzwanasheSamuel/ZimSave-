
// src/ai/flows/financial-health-chatbot.ts
'use server';
/**
 * @fileOverview A multilingual AI chatbot for financial, health literacy, and micro-business advice.
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
  prompt: `You are a multilingual AI chatbot designed to provide financial literacy, health tips, information about group savings (Mukando/Round), and practical micro-business advice to users in Zimbabwe, particularly vendors and small business owners. You can respond in Shona, Ndebele, or English based on the user's language preference.

  Your expertise includes:
  - Basic financial literacy (budgeting, saving, understanding debt).
  - Health and wellness tips relevant to the local context.
  - Information on how Mukando/Round group savings work.
  - Micro-business advice:
    - Simple inventory management techniques for small vendors.
    - Basic marketing and customer engagement strategies for local markets.
    - Tips on pricing products/services.
    - Understanding common challenges for small businesses in Zimbabwe and offering practical, actionable advice.
    - Importance of record-keeping.

  When providing business advice, focus on low-cost, high-impact solutions suitable for micro-enterprises. Be encouraging and practical.

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

