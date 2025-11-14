import { useState, useMemo } from "react";
import { useAppSelector } from "../../app/hooks";
import MessageBubble from "./MessageBubble";

export default function ChatBox({ label, messages, side, onSend, userSide }) {
  const [text, setText] = useState("");

  const { round, maxPerRound } = useAppSelector((state) => state.chat);

  const messagesThisRound = useMemo(() => {
    return messages.filter(m => m.round === round).length;
  }, [messages, round]);

  const isUserSide =
    (userSide === "A" && side === "sideA") ||
    (userSide === "B" && side === "sideB");

  const reachedLimit = messagesThisRound >= maxPerRound;
  const allRoundsComplete = round > 5;

  const sendMessage = () => {
    if (!text.trim() || reachedLimit || !isUserSide || allRoundsComplete) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="font-bold text-lg sm:text-xl mb-2 text-slate-800 border-b-2 border-amber-600 pb-2">
        {label}
      </h2>

      <p className="text-xs sm:text-sm text-gray-600 mb-3 font-medium">
        Round {round}/5 • {messagesThisRound}/{maxPerRound} arguments used
      </p>

      {/* CHAT AREA - Fixed max height with scroll */}
      <div 
        className="flex-1 mb-3 border-2 border-gray-300 rounded bg-white shadow-inner overflow-hidden" 
        style={{ maxHeight: 'calc(100vh - 300px)' }}
      >
        <div className="h-full overflow-y-auto p-3">
          <div className="flex flex-col gap-3">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <MessageBubble key={index} message={msg} />
              ))
            ) : (
              <p className="text-gray-400 italic text-center py-8">
                No arguments submitted yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* INPUT AREA */}
      {!allRoundsComplete && isUserSide ? (
        <div className="flex gap-2">
          <input
            disabled={reachedLimit}
            className={`border-2 p-2 sm:p-3 w-full rounded text-sm sm:text-base ${
              reachedLimit 
                ? "bg-gray-200 cursor-not-allowed border-gray-300" 
                : "border-slate-400 focus:border-amber-600 focus:outline-none"
            }`}
            placeholder={
              reachedLimit
                ? "Limit reached this round"
                : "Enter your argument..."
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={sendMessage}
            disabled={reachedLimit}
            className={`px-3 sm:px-4 rounded text-white font-semibold whitespace-nowrap text-sm sm:text-base border ${
              reachedLimit
                ? "bg-gray-400 cursor-not-allowed border-gray-300"
                : "bg-slate-700 hover:bg-slate-800 border-slate-600 shadow"
            }`}
          >
            Send
          </button>
        </div>
      ) : allRoundsComplete ? (
        <div className="text-center p-3 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-semibold text-sm sm:text-base">
          ✓ All 5 rounds completed
        </div>
      ) : (
        <div className="text-center p-2 text-gray-600 italic text-xs sm:text-sm bg-gray-100 rounded border border-gray-300">
          You can only submit arguments for your assigned side
        </div>
      )}
    </div>
  );
}
