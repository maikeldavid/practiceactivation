
import { GoogleGenAI, Chat } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

let ai: GoogleGenAI | null = null;

const getAi = () => {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY is not set in environment variables.");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};

export const initChat = (): Chat => {
    const genAI = getAi();
    return genAI.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: 'You are a helpful and friendly assistant for ITERA HEALTH, a company that provides a connected care ecosystem for value-based care. Answer questions about the company, its services (APCM, CCM, RPM, etc.), and the value-based care model. Be professional, concise, and supportive. Do not provide medical advice.',
        },
    });
};

export const sendMessage = async (chat: Chat, message: string): Promise<string> => {
    try {
        const response: GenerateContentResponse = await chat.sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        return "I'm sorry, I'm having trouble connecting at the moment. Please try again later.";
    }
};
