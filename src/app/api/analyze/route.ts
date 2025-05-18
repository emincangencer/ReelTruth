import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: NextRequest) {
  try {
    const { url, language } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
    }
    if (!language) {
      return NextResponse.json({ error: 'Missing language' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY environment variable not set.");
      return NextResponse.json({ error: 'Server configuration error: API key missing.' }, { status: 500 });
    }

    console.log(`Analyzing URL using GenAI API: ${url}`);

    // Initialize the Gemini API client
    const genAI = new GoogleGenAI({ apiKey: apiKey });

    // Prepare content for inline video using fileUri
    const videoContent = {
      fileData: {
        fileUri: url, // Pass the URL directly to the API
      },
    };

    // --- Step 1: Extract Statements ---
    const extractPrompt = `You are an AI assistant analyzing a video to identify claims that require critical evaluation. Your task is to carefully watch and listen to the video and identify all significant claims or assertions presented as facts that a viewer might not be able to easily verify or judge the reasonableness of based solely on common knowledge or the video itself.

Instructions:
- Analyze the video and audio content together.
- List each significant claim or assertion that requires external knowledge or critical thinking to evaluate.
- Filter out subjective opinions, trivial statements, or claims that are immediately verifiable within the video context (e.g., "I am wearing a blue shirt" if the speaker is clearly wearing a blue shirt).
- Present the extracted claims as a simple, numbered list.
- Provide the output in ${language} language.
`;

    const extractContents = [videoContent, { text: extractPrompt }];

    console.log("Step 1: Extracting factual statements...");
    const extractResponse = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: extractContents,
    });
    const extractedStatements = extractResponse.text;
    console.log("Statements extracted.");
    console.log(extractedStatements); // Optional: log extracted statements

    // --- Step 2: Evaluate Statements ---
    const evaluatePrompt = `You are a truth seeker and judge evaluating claims from a video. You will be provided with a list of claims extracted from the video that require critical evaluation. Your goal is to determine the truthfulness and reasonableness of these claims by cross-referencing them with your extensive general knowledge and using the video context to understand the claim being made.

Instructions:
- Consider the following extracted claims from the video:
${extractedStatements}

- For each claim in the list:
    - Briefly explain the claim in the context of the video.
    - Evaluate the truthfulness and reasonableness of the claim by comparing it against your general knowledge and understanding of the world. Use the video's visual and auditory information to fully grasp the claim being made, but do not limit your judgment to just what is presented in the video.
    - Provide a judgment:
        - 'True': If the claim is well-supported by your general knowledge and appears reasonable in context.
        - 'False': If the claim is contradicted by your general knowledge or is clearly unreasonable.
        - 'Undetermined': If your general knowledge does not provide sufficient information to confirm or deny the claim, or if the claim is highly speculative.
    - Provide a clear and concise reason for your judgment, explaining how your general knowledge and the video context led to your conclusion. Be specific about what is known and how it relates to the claim.
- After evaluating all the claims, provide a brief overall judgment summarizing the key findings regarding the truthfulness and reasonableness of the significant claims made in the video based on your knowledge and the evidence presented.
- Provide the entire analysis output in ${language} language.
`;

    const evaluateContents = [videoContent, { text: evaluatePrompt }];

    console.log("Step 2: Evaluating statements...");
    const evaluateResponse = await genAI.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: evaluateContents,
    });
    const analysisResult = evaluateResponse.text;
    console.log("Evaluation complete.");

    return NextResponse.json({ analysis: analysisResult });

  } catch (error: unknown) {
    console.error("API error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
}
