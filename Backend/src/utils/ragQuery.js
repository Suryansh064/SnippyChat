// utils/ragQuery.js
import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});
const History = []; 

export async function rewriteFollowUp(question) {
  // Optional: rewrite follow-up into standalone question
    History.push({ role: "user", parts: [{ text: question }] });
    const resp = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: History,
    config: {
    systemInstruction: `
You are a query rewriting expert. Based on the provided chat history, rephrase the user's follow-up into a complete, standalone question.
Only output the rewritten question and nothing else.
        `,
    },
    });
    History.pop();
    return resp.text?.trim?.() ?? question;
}
export async function queryPineconeAndAnswer(question, topK = 5) {
    try {
    const finalQuery = await rewriteFollowUp(question);

    // Create embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
        model: "text-embedding-004",
    });

    const queryVector = await embeddings.embedQuery(finalQuery);

    // Pinecone setup
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    // Query Pinecone
    const searchResults = await pineconeIndex.query({
        topK,
        vector: queryVector,
        includeMetadata: true,
    });

    const matches = searchResults.matches || [];

    // ✅ 1. Check if context is too weak
    if (matches.length === 0 || matches[0].score < 0.35) {
        console.log("⚠️ No relevant PDF context found.");
      return null; // → triggers Gemini fallback on frontend
    }

    // Build context
    const context = matches
    .map((m) =>
    m.metadata?.text ||
    m.metadata?.pageContent ||
    m.metadata?.content ||
    ""
    )
    .join("\n\n---\n\n");


    const prompt = `
        You are an assistant answering based on PDF context only.
        If the context doesn’t contain the answer, reply exactly: "I could not find the answer in the provided document."

        Context:${context}
        Question:${finalQuery}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const answer =
        response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim?.() ||
        response?.response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim?.() ||
        ""; 

    // ✅ 2. If Gemini says “I could not find…” → treat as null
    if (!answer || /could not find/i.test(answer)) {
        return null;
    }

    return answer;
    } catch (err) {
    console.error("Query error:", err);
    return null;
}
}
