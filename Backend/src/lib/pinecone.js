// lib/pinecone.js
import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
dotenv.config();

export function getPineconeIndex() {
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    return index;
}
