import { useState, useRef, useCallback, type KeyboardEvent } from "react";

interface MessageInputProps {
  onSend: (content: string) => void;
  isDisabled?: boolean;
  placeholder?: string;
}

export default function MessageInput({
  onSend,
  isDisabled = false,
  placeholder = "Type a message…",
}: MessageInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      // Reset height, then set to scrollHeight
      const el = e.target;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    },
    [],
  );

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isDisabled) return;
    onSend(trimmed);
    setValue("");
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  }, [value, isDisabled, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const canSend = value.trim().length > 0 && !isDisabled;

  return (
    <div className="px-6 py-4 border-t border-surface-border bg-surface flex-shrink-0">
      <div className="flex items-end gap-3 bg-surface-light border border-surface-border rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-accent/40 focus-within:border-accent/50 transition-all duration-200">
        {/* Attachment button */}
        <button
          title="Attach file"
          className="flex-shrink-0 p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-surface-card transition-all duration-150 mb-0.5"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          placeholder={placeholder}
          rows={1}
          className="
            flex-1 bg-transparent text-sm text-white placeholder-slate-500
            resize-none focus:outline-none leading-relaxed
            disabled:opacity-50 disabled:cursor-not-allowed
            min-h-[24px] max-h-[160px] py-0.5
          "
        />

        {/* Emoji button */}
        <button
          title="Insert emoji"
          className="flex-shrink-0 p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-surface-card transition-all duration-150 mb-0.5"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          title="Send message (Enter)"
          className={`
            flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
            transition-all duration-200 mb-0.5
            ${
              canSend
                ? "bg-accent hover:bg-accent-dim text-white shadow-accent-glow hover:shadow-none"
                : "bg-surface-card text-slate-600 cursor-not-allowed"
            }
          `}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>

      {/* Hint */}
      <p className="text-xs text-slate-600 mt-2 text-center">
        Press{" "}
        <kbd className="font-mono bg-surface-card border border-surface-border rounded px-1 py-0.5 text-slate-400">
          Enter
        </kbd>{" "}
        to send,{" "}
        <kbd className="font-mono bg-surface-card border border-surface-border rounded px-1 py-0.5 text-slate-400">
          Shift + Enter
        </kbd>{" "}
        for new line
      </p>
    </div>
  );
}
