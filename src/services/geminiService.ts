import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getPanetResponse(
  prompt: string, 
  history: { role: "user" | "model"; parts: { text: string }[] }[],
  systemInstruction?: string
) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", 
      contents: [...history, { role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: systemInstruction || "Tên của bạn là Panet. Bạn là một trợ lý AI thông minh, thân thiện và hữu ích. Hãy trả lời ngắn gọn, súc tích bằng tiếng Việt."
      }
    });

    return response.text || "Xin lỗi, mình không hiểu ý bạn lắm.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Xin lỗi, Panet đang gặp một chút sự cố kỹ thuật. Bạn thử lại sau nhé!";
  }
}
