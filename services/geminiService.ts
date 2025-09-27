import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

interface ImagePart {
  data: string;
  mimeType: string;
}

export async function* reviewCode(prompt: string, language: string, image?: ImagePart | null) {
  const model = "gemini-2.5-flash";

  const codeSystemInstruction = `You are an expert code reviewer. Analyze the following ${language} code and provide feedback.
Structure your response under the following heading:

### Code Review
Focus on these key areas:
1.  **Bugs and Errors**: Identify any potential bugs, logic errors, or edge cases that are not handled.
2.  **Performance**: Suggest optimizations for performance, memory usage, or efficiency.
3.  **Best Practices & Readability**: Check for adherence to common best practices, code style conventions, and overall readability. Suggest clearer names for variables and functions if needed.
4.  **Security**: Point out any potential security vulnerabilities.

Provide your feedback in Markdown format. Use code blocks for suggestions and keep your explanations clear and concise.`;

  const imageSystemInstruction = `You are an expert UI/UX and system architecture design reviewer.
Analyze the provided image and provide a detailed review based on the user's prompt.

Structure your response under the following heading:
### Review
Focus on these key areas:
1.  **Clarity and Usability**: Evaluate the design's clarity, user flow, and ease of use.
2.  **Best Practices**: Check for adherence to common UI/UX design principles or architectural best practices.
3.  **Suggestions for Improvement**: Provide concrete suggestions for how the design or diagram could be improved.
4.  **Security/Scalability (if applicable)**: If it's an architecture diagram, point out potential security or scalability concerns.

Provide your feedback in Markdown format. Use lists and bold text to structure your review.`;

  const systemInstruction = image ? imageSystemInstruction : codeSystemInstruction;
  
  let contents: any;

  if (image) {
    contents = { 
      parts: [
        { text: prompt },
        { inlineData: { mimeType: image.mimeType, data: image.data } }
      ]
    };
  } else {
    contents = prompt;
  }

  const response = await ai.models.generateContentStream({
    model,
    contents,
    config: {
      systemInstruction,
    }
  });

  for await (const chunk of response) {
    yield chunk;
  }
}