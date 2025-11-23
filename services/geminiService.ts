import { GoogleGenAI } from "@google/genai";
import { Message } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const GeminiService = {
  analyzeVibe: async (messages: Message[]): Promise<string> => {
    const ai = getClient();
    if (!ai) return "AI服务不可用 (缺少 Key)";

    // Filter out system messages and take last 20
    const chatHistory = messages
      .filter(m => m.type !== 'system')
      .slice(-20)
      .map(m => `${m.senderName}: ${m.content}`)
      .join('\n');

    if (!chatHistory) return "聊天记录太少啦，多聊几句再来找我吧！";

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are a relationship expert and a friendly AI companion for a couple. 
        Analyze the following recent chat history between two people. 
        Give a short, fun, and warm summary of their "vibe" or current mood in Chinese (Simplified). 
        Keep it under 50 words. Be encouraging and cute.
        
        Chat History:
        ${chatHistory}`,
      });
      return response.text || "暂时无法分析氛围。";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "哎呀，我有点晕，稍后再试吧！";
    }
  },

  suggestTopic: async (): Promise<string> => {
    const ai = getClient();
    if (!ai) return "AI服务不可用";

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: "Suggest one fun, deep, or romantic conversation starter question for a couple to ask each other right now. Output only the question in Chinese (Simplified).",
      });
      return response.text || "今天发生了什么让你开心的事吗？";
    } catch (error) {
      return "可以说说你最喜欢我们共同的哪个回忆吗？";
    }
  },

  generateLoveNote: async (senderName: string, receiverName: string, tone: string): Promise<string> => {
     const ai = getClient();
    if (!ai) return "AI服务不可用";

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Write a short, ${tone} note from ${senderName} to ${receiverName} in Chinese (Simplified). Max 2 sentences.`,
      });
      return response.text || "我爱你！";
    } catch (error) {
      return "想你了！";
    }
  }
};