import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: { responseMimeType: "text/plain" },
  safetySettings: [
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  ],
});

export async function getGeminiResponse(question: string): Promise<string> {
  if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not set");
  }

  try {
    question = `There is an interview going and you are listening to the interviewer side of the interview. 
    Try to help the candidate by giving short answers and to the point(limit the responses in bullet points) 
    so that he can crack the interview. Only markdown language is supported.
    Here is the interviewer side transcript: ${question}`;
    console.log("Gemini Question:", question);
    const result = await model.generateContent(question);
    const response = await result.response;
    console.log("Gemini response:", response.text());
    return response.text();
  } catch (error) {
    console.error("Error getting Gemini response:", error);
    throw new Error("Failed to get Gemini response");
  }
}