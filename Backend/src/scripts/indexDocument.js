// scripts/indexDocument.js
import * as dotenv from "dotenv";
dotenv.config();

import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

async function indexDocument(filePath) {
    try {
    console.log("📄 Loading PDF:", filePath);
    const loader = new PDFLoader(filePath);
    const rawDocs = await loader.load();
    console.log("Loaded pages:", rawDocs.length);

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 200,
    });
    const docs = await splitter.splitDocuments(rawDocs);
    console.log("Chunked into:", docs.length);

    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
        model: "text-embedding-004",
    });

    // init pinecone
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    console.log("Uploading to Pinecone...");
    await PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex,
        maxConcurrency: 5,
    });

    console.log("✅ Indexing complete. Vectors stored in Pinecone.");
    } catch (err) {
    console.error("Indexing error:", err);
    process.exit(1);
}
}

const PDF_PATH = process.argv[2] || "./src/uploads/chat.pdf"; // pass path or default
indexDocument(PDF_PATH).then(() => process.exit(0));
