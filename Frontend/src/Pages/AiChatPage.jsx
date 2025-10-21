import React, { useState, useRef } from "react";

const API_KEY = import.meta.env.VITE_API_KEY;
const MODEL = "gemini-2.5-flash";

export default function AiChatPage() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const chatBoxRef = useRef(null);

    const appendMessage = (role, text) => {
    setMessages((prev) => [...prev, { role, text }]);
    setTimeout(() => {
        if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, 100);
    };

    async function getBotReply(prompt) {
    const systemPrompt = `
    You are FriendlyAI 💬 — a kind, funny, and caring virtual friend.
    Always reply in a friendly, conversational tone with short, natural sentences.
    Use emojis sometimes 😊💫✨ if it fits the mood.
    You can talk about life, emotions, hobbies, studies, etc.
    Keep responses human-like and warm. Never say you're an AI.
    `;

    const body = {
        contents: [
        {
            role: "user",
            parts: [{ text: `${systemPrompt}\nUser: ${prompt}` }],
        },
        ],
    };

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
        {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        }
    );

    const data = await res.json();
    return (
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Hmm... I'm not sure how to reply 😅"
    );
    }

    const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    appendMessage("user", userMessage);

    setIsTyping(true);
    setLoading(true);
    const reply = await getBotReply(userMessage);
    setIsTyping(false);
    setLoading(false);

    appendMessage("bot", reply);
    };

    return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 p-2">
        <div className="w-full max-w-md bg-white text-gray-800 rounded-2xl shadow-2xl flex flex-col h-[80vh]">
        <h2 className="text-xl font-bold text-center text-gray-800 mt-3 mb-3">
            💬 Chat with Your AI Friend
        </h2>

        {/* Chat Box */}
        <div
            ref={chatBoxRef}
            className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-100 bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-200 rounded-xl mx-4 mb-3 p-3 shadow-inner"
            style={{ height: "420px" }}
        >
            {messages.length === 0 ? (
            <p className="text-center text-gray-400 mt-20">
                Start chatting with your AI friend 😊
            </p>
            ) : (
            <>
                {messages.map((msg, i) => (
                <div
                    key={i}
                    className={`my-2 flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                    <div
                    className={`max-w-[80%] px-3 py-2 text-sm leading-relaxed rounded-2xl shadow-sm ${
                        msg.role === "user"
                        ? "bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 text-white rounded-br-none"
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                >
                    {msg.text}
                </div>
                </div>
            ))}

            {isTyping && (
                <div className="my-2 flex justify-start">
                <div className="max-w-[80%] px-3 py-2 text-sm leading-relaxed rounded-2xl shadow-sm bg-gray-200 text-gray-600 rounded-bl-none">
                    AI Friend is typing...
                </div>
                </div>
            )}
            </>
        )}
        </div>

        {/* Input Area */}
        <div className="flex gap-2 px-4 pb-3 mt-auto">
            <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a friendly message..."
            className="flex-1 rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2  transition"
        />
        <button
            onClick={handleSend}
            disabled={loading}
            className="px-5 py-2 bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 text-white rounded-xl font-medium shadow-md transition"
        >
            {loading ? "..." : "Send"}
        </button>
        </div>
    </div>
    </div>
    );
}
