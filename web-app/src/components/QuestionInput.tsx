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
      <form onSubmit={handleSubmit} className="rounded-[24px] border border-[#8f6d41]/18 bg-[linear-gradient(180deg,rgba(25,18,13,0.92),rgba(14,10,8,0.88))] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.48)] backdrop-blur-2xl md:rounded-[28px] md:p-4">
        <div className="mb-3 flex flex-col gap-2 px-2 md:flex-row md:items-center md:justify-between">
          <p className="text-[11px] uppercase tracking-[0.34em] text-[#c7a66d]">Intent Capture</p>
          <p className="text-xs text-[#cbb89a]/65">问题越具体，解读越不空泛。</p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            ref={inputRef}
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="在此输入你的执念、困惑，或你真正想问的问题……"
            className="h-14 w-full flex-1 rounded-2xl border border-[#8f6d41]/16 bg-[#1a130f]/85 px-4 text-[15px] text-[#f3e8d5] outline-none transition placeholder:text-[#b69d76]/45 focus:border-[#caa15e]/45 focus:bg-[#201712] focus:shadow-[0_0_0_1px_rgba(202,161,94,0.18)] md:px-5"
          />
          <button
            type="submit"
            disabled={!question.trim()}
            className={`h-14 w-full rounded-2xl border px-6 text-xs uppercase tracking-[0.3em] transition md:min-w-[180px] md:w-auto ${
              question.trim()
                ? "border-[#c79a56]/35 bg-[#342213] text-[#f7e7c1] shadow-[0_0_28px_rgba(199,154,86,0.14)] hover:border-[#ddb06d]/55 hover:bg-[#442b17]"
                : "border-[#7e6540]/18 bg-[#17120e] text-[#7d694b]"
            }`}
          >
            注入观测
          </button>
        </div>
      </form>
    </div>
  );
}

