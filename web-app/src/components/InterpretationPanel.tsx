import { useEffect, useState } from 'react';

interface InterpretationPanelProps {
  card: any;
  text: string;
  isThinking: boolean;
  onClear: () => void;
}

export default function InterpretationPanel({ card, text, isThinking, onClear }: InterpretationPanelProps) {
  const [displayedText, setDisplayedText] = useState('');
  
  // 打字机效果逻辑
  useEffect(() => {
    if (isThinking || !text) {
      setDisplayedText('');
      return;
    }
    
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, currentIndex + 1));
      currentIndex++;
      if (currentIndex >= text.length) {
        clearInterval(intervalId);
      }
    }, 30); // 调整打字速度
    
    return () => clearInterval(intervalId);
  }, [text, isThinking]);

  return (
    <div className="h-full w-full p-4 md:p-6 pointer-events-auto">
      <div className="flex h-full flex-col rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,12,20,0.9),rgba(5,6,10,0.85))] p-6 shadow-[-24px_0_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl md:p-8">
        <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-white/35">
            {isThinking ? 'COMPUTING COLLAPSE...' : 'WAVE FUNCTION COLLAPSED'}
            </p>
            <h2 className="text-3xl font-semibold tracking-[0.08em] text-white">
              {card.title}
            </h2>
            <p className="mt-2 text-sm tracking-[0.24em] text-white/48">{card.name}</p>
          </div>
          <span className={`rounded-full border px-3 py-2 text-[11px] uppercase tracking-[0.26em] ${card.reversed ? 'border-rose-300/25 bg-rose-300/10 text-rose-200' : 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100'}`}>
            {card.reversed ? 'Reversed' : 'Upright'}
          </span>
        </div>

        <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-white/58">
          本轮抽取不是结论，而是一次切片。它显示的是当前问题在此刻最容易坍缩出的解释路径。
        </div>

        <div className="custom-scrollbar flex-1 overflow-y-auto pr-2">
          {isThinking ? (
            <div className="flex h-full flex-col items-center justify-center opacity-60">
              <span className="mb-5 h-10 w-10 rounded-full border-4 border-white/10 border-t-cyan-200 animate-spin"></span>
              <p className="text-sm tracking-[0.24em] text-white/70">正在链接高维网络解析</p>
            </div>
          ) : (
            <div className="whitespace-pre-wrap text-[15px] font-light leading-8 tracking-[0.04em] text-white/75">
              {displayedText}
              <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-white/70 animate-pulse"></span>
            </div>
          )}
        </div>

        {!isThinking && text && (
          <button
            onClick={onClear}
            className="mt-6 rounded-2xl border border-white/12 bg-white/[0.04] py-4 text-xs uppercase tracking-[0.3em] text-white/78 transition hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-white"
          >
            扰动波函数 · 重新抽牌
          </button>
        )}
      </div>
    </div>
  );
}
