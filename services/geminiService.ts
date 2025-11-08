
import { GoogleGenAI } from "@google/genai";
import { AgentType, StakeholderPersona } from '../types';
import { getSystemPrompt } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateResponse = async (
    userInput: string,
    agent: AgentType,
    persona?: StakeholderPersona,
    chatHistory: { role: 'user' | 'model', parts: { text: string }[] }[] = []
): Promise<string> => {
    try {
        const systemInstruction = getSystemPrompt(agent, persona);
        
        // FIX: Per @google/genai guidelines, call ai.models.generateContent directly.
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: [...chatHistory, { role: 'user', parts: [{ text: userInput }] }],
            config: {
              systemInstruction: systemInstruction,
            }
        });

        return response.text;

    } catch (error) {
        console.error("Error generating response from Gemini API:", error);
        if (error instanceof Error) {
            return `An error occurred: ${error.message}. Please check your API key and network connection.`;
        }
        return "An unknown error occurred while contacting the AI."
    }
};
