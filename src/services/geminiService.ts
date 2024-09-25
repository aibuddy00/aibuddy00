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

export function storeInterviewMetadata(metadata: string) {
  localStorage.setItem("interviewMetadata", metadata);
}

export function getInterviewMetadata(): string {
  return localStorage.getItem("interviewMetadata") || "";
} 

// Add this new interface
interface InterviewHistory {
  question: string;
  response: string;
}

// Update this function to manage interview history
function manageInterviewHistory(question: string, response: string) {
  const history: InterviewHistory[] = JSON.parse(localStorage.getItem("interviewHistory") || "[]");
  history.push({ question, response });
  if (history.length > 3) {
    history.shift();
  }
  localStorage.setItem("interviewHistory", JSON.stringify(history));
}

// Update the getGeminiResponse function
export async function getGeminiResponse(question: string): Promise<string> {
  if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
    throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not set");
  }

  try {
    const metadata = getInterviewMetadata();
    const history: InterviewHistory[] = JSON.parse(localStorage.getItem("interviewHistory") || "[]");
    const metadataEarlier = history.map(item => `Q: ${item.question}\nA: ${item.response}`).join("\n\n");

    const prompt = `There is an interview going and you are listening to the interviewer side of the interview. 
    Try to help the candidate by giving short answers and to the point (limit the responses in bullet points unless it is not possible to answer in a bullet point). 
    Assume there can be translation issues and try to correct the correct answers where possible. Focus on the interview job role and answer in that context.
    Here are some additional details about the candidate and interview: ${metadata}
    Here is earlier transcript (last 3 interactions):
    ${metadataEarlier}
    Here is the interviewer side transcript: ${question}`;

    console.log("Gemini Question:", prompt);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log("Gemini response:", response.text());

    // Store the new question and response in the history
    manageInterviewHistory(question, response.text());

    return response.text();
  } catch (error) {
    console.error("Error getting Gemini response:", error);
    throw new Error("Failed to get Gemini response");
  }
}