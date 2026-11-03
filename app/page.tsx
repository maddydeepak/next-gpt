"use client";

import { useState } from "react";
import { requestAiAction } from "@/app/actions/aiAction";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [submitClicked, setSubmitClicked] = useState(false);

  const promptHandler = async () => {
    // const promptRespose = await requestAiAction(input);
    // setResponse(promptRespose);
    if (!input.trim() || submitClicked) return;
    try {
      setSubmitClicked(true);
      // const result = await requestAiAction(input);
      // setResponse(result);
    } catch (error) {
      console.error(error);
    } finally {
      // setSubmitClicked(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f0f4f9] text-[#1f1f1f]">
      {submitClicked && (
        <div className="flex-1 overflow-y-auto px-4 py-8">
          <div className="max-w-3xl mx-auto space-y-10">
            <div className="flex justify-end">
              <div className="bg-[#d3e3fd] rounded-3xl px-5 py-3 max-w-[80%] text-[#1f1f1f]">
                {input}
              </div>
            </div>

            <div className="flex justify-start gap-3">
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#4285f4] via-[#a142f4] to-[#e45a91] shrink-0" />
              <div className="max-w-[85%] leading-7 text-[#30343b]">
                {input}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="w-full px-4 pb-6 pt-3 fixed bottom-0">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#e9eef6] rounded-[28px] px-5 py-4 border border-[#e1e5eb] shadow-sm flex">
            <textarea
              placeholder="Ask me anything..."
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-[88%] bg-transparent overflow-y-auto [&::-webkit-scrollbar]:hidden text-[#1f1f1f] placeholder-[#73777f] resize-none outline-none py-2 max-h-40"
            />
            <button
              className="w-[8%] flex items-center justify-center bg-[#d3e3fd] hover:bg-[#c2d7f7] text-[#174ea6] rounded-full w-10 h-10 flex items-center justify-center text-xl cursor-pointer"
              onClick={promptHandler}
              disabled={submitClicked}
            >
              ↑
            </button>
          </div>
          <p className="text-center text-xs text-[#73777f] mt-3">
            AI can make mistakes, so plesae double-check it.
          </p>
        </div>
      </div>
    </div>
  );
}
