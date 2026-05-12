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
  }, [isVisible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question.trim());
    }
  };

  return (
    <div 
      className={`absolute bottom-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-20 transition-all duration-1000 ${
        isVisible ? "opacity-100 transform-none" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          ref={inputRef}
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="在此输入你的执念或疑团......"
          className="w-full bg-transparent border-b border-white/20 px-4 py-3 text-center text-white/90 focus:outline-none focus:border-white/60 focus:bg-white/5 transition-all font-light text-lg placeholder-white/20"
        />
        <button 
          type="submit" 
          disabled={!question.trim()}
          className={`mt-6 px-12 py-3 rounded-full border text-xs tracking-[0.3em] font-light transition-all duration-500 ${
            question.trim() 
              ? "border-white/40 bg-white/10 text-white/90 hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] cursor-pointer"
              : "border-white/10 text-white/20 cursor-not-allowed"
          }`}
        >
          注 入 观 测
        </button>
      </form>
    </div>
  );
}

