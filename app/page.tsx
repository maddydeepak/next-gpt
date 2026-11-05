"use client";

import { useState } from "react";
import { requestAiAction } from "@/app/actions/aiAction";
import Loader from "@/app/Loader";

type Message = {
  id: number;
  role: "user" | "ai";
  content: string;
  loading?: boolean;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [submitClicked, setSubmitClicked] = useState(false);

  const promptHandler = async () => {
    if (!input.trim() || submitClicked) return;

    const prompt = input.trim();
    const userId = Date.now();

    try {
      setSubmitClicked(true);
      setInput("");

      // Add user message and AI loader
      setMessages((prev) => [
        ...prev,
        {
          id: userId,
          role: "user",
          content: prompt,
        },
        {
          id: userId + 1,
          role: "ai",
          content: "",
          loading: true,
        },
      ]);

      const result = await requestAiAction(prompt);

      // Update the corresponding AI message
      setMessages((prev) =>
        prev.map((message) =>
          message.id === userId + 1
            ? {
                ...message,
                content: result,
                loading: false,
              }
            : message,
        ),
      );
    } catch (error) {
      console.error("AI Error:", error);

      setMessages((prev) =>
        prev.map((message) =>
          message.id === userId + 1
            ? {
                ...message,
                content: "Something went wrong. Please try again.",
                loading: false,
              }
            : message,
        ),
      );
    } finally {
      setSubmitClicked(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f0f4f9] text-[#1f1f1f]">
      {messages.length === 0 ? (
        // Greeting message - visible only on initial page load
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h1 className="text-4xl font-semibold bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Hello, how can I help you?
          </h1>
          <p className="text-gray-500 mt-3">
            Ask me anything. I'm here to help!
          </p>
        </div>
      ) : (
        // Your existing chat messages
        <div className="flex-1 overflow-y-auto px-4 py-8 pb-40">
          <div className="w-full max-w-3xl mx-auto space-y-10">
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? "flex justify-end w-full"
                    : "flex justify-start gap-3 w-full"
                }
              >
                {message.role === "user" ? (
                  <div className="bg-[#d3e3fd] rounded-3xl px-5 py-3 max-w-[80%] text-[#1f1f1f] whitespace-pre-wrap">
                    {message.content}
                  </div>
                ) : (
                  <>
                    <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#4285f4] via-[#a142f4] to-[#e45a91] shrink-0" />

                    <div className="flex-1 max-w-[85%] leading-7 text-[#30343b] whitespace-pre-wrap">
                      {message.loading ? <Loader /> : message.content}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="w-full px-4 pb-6 pt-3 fixed bottom-0 bg-[#f0f4f9]">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#e9eef6] rounded-[28px] px-5 py-4 border border-[#e1e5eb] shadow-sm flex items-center">
            <textarea
              placeholder="Ask me anything..."
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={submitClicked}
              className="w-[88%] bg-transparent overflow-y-auto [&::-webkit-scrollbar]:hidden text-[#1f1f1f] placeholder-[#73777f] resize-none outline-none py-2 max-h-40 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <div className="w-[12%] flex items-center justify-center">
              <button
                className="w-10 h-10 flex items-center justify-center bg-[#d3e3fd] hover:bg-[#c2d7f7] text-[#174ea6] rounded-full text-xl enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                onClick={promptHandler}
                disabled={submitClicked || !input.trim()}
              >
                ↑
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-[#73777f] mt-3">
            AI can make mistakes, so please double-check it.
          </p>
        </div>
      </div>
    </div>
  );
}
