import { useState, useRef, useEffect } from "react";

type QuestionInputProps = {
  onSubmit: (question: string) => void;
  isVisible: boolean;
};

export default function QuestionInput({ onSubmit, isVisible }: QuestionInputProps) {
  const [question, setQuestion] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isVisible) {
      setQuestion("");
    }
  }, [isVisible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question.trim());
    }
  };

  return (
    <div
      className={`w-full max-w-[780px] transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <form onSubmit={handleSubmit} className="rounded-[28px] border border-white/10 bg-black/45 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-4">
        <div className="mb-3 flex flex-col gap-2 px-2 md:flex-row md:items-center md:justify-between">
          <p className="text-[11px] uppercase tracking-[0.34em] text-white/45">Intent Capture</p>
          <p className="text-xs text-white/35">问题越具体，解读越不空泛。</p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            ref={inputRef}
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="在此输入你的执念、困惑，或你真正想问的问题……"
            className="h-14 flex-1 rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-[15px] text-white outline-none transition placeholder:text-white/20 focus:border-cyan-300/40 focus:bg-white/[0.07] focus:shadow-[0_0_0_1px_rgba(103,232,249,0.2)]"
          />
          <button
            type="submit"
            disabled={!question.trim()}
            className={`h-14 min-w-[180px] rounded-2xl border px-6 text-xs uppercase tracking-[0.3em] transition ${
              question.trim()
                ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.18)] hover:border-cyan-200/50 hover:bg-cyan-300/15"
                : "border-white/10 bg-white/[0.03] text-white/25"
            }`}
          >
            注入观测
          </button>
        </div>
      </form>
    </div>
  );
}

