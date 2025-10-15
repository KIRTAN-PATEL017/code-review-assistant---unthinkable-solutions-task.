import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const handleFileUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    const code = req.file.buffer.toString("utf8");

    const prompt = `
You are an AI code reviewer. Analyze the following code and return a JSON response in this format:

{
  "id": "<uuid>",
  "projectName": "Uploaded Code Review",
  "timestamp": "<timestamp>",
  "diffs": [
    {
      "file": "<filename>",
      "path": "<filepath>",
      "status": "new",
      "oldCode": "",
      "newCode": "<code>",
      "comments": [
        {
          "id": "<uuid>",
          "line": <line_number>,
          "message": "<comment>",
          "category": "<bug|performance|readability|security|style>",
          "severity": "<high|medium|low>"
        }
      ]
    }
  ],
  "summary": {
    "totalIssues": <count>,
    "byCategory": {},
    "bySeverity": {}
  }
}

Code:
${code}
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean up and extract JSON safely
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const reviewData = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    res.status(200).json({
      success: true,
      data: reviewData,
    });
  } catch (error) {
    console.error("Gemini Review Error:", error.message);
    next(error);
  }
};