// // controllers/rag.controller.js
import { queryPineconeAndAnswer } from '../utils/ragQuery.js';

export const askFromPdf = async (req, res) => {
try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question is required" });

    const answer = await queryPineconeAndAnswer(question);
    return res.json({ answer });
} catch (err) {
    console.error("askFromPdf error:", err);
    return res.status(500).json({ error: "Failed to answer from PDF" });
}
};



