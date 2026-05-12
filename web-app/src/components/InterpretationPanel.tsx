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
    <div className="absolute right-0 top-0 h-full w-[400px] z-20 flex flex-col p-8 pointer-events-auto">
      <div className="mt-20 h-full bg-black/40 backdrop-blur-xl border-l border-white/10 rounded-l-3xl p-8 flex flex-col shadow-[-10px_0_50px_rgba(0,0,0,0.5)] transition-all duration-700">
        
        {/* 卡牌基础信息 */}
        <div className="mb-6 border-b border-white/10 pb-6">
          <p className="text-white/40 text-xs tracking-[0.2em] mb-2 font-mono">
            {isThinking ? 'COMPUTING COLLAPSE...' : 'WAVE FUNCTION COLLAPSED'}
          </p>
          <h2 className="text-2xl font-light text-white/90 tracking-widest">
            {card.title} <span className="text-white/50 text-base">{card.name}</span>
          </h2>
          <p className={`mt-2 text-sm tracking-widest ${card.reversed ? 'text-red-400/80' : 'text-blue-400/80'}`}>
            [{card.reversed ? '逆位 (Reversed)' : '正位 (Upright)'}]
          </p>
        </div>

        {/* 解读区域 */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {isThinking ? (
            <div className="flex flex-col items-center justify-center h-full opacity-50">
              <span className="w-8 h-8 border-4 border-white/20 border-t-white/80 rounded-full animate-spin mb-4"></span>
              <p className="text-sm font-light tracking-widest">正在链接高维网络解析...</p>
            </div>
          ) : (
            <div className="text-white/70 font-light leading-relaxed tracking-wider text-sm whitespace-pre-wrap">
              {displayedText}
              <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-white/70 animate-pulse"></span>
            </div>
          )}
        </div>

        {/* 底部重置按钮 */}
        {!isThinking && text && (
          <button 
            onClick={onClear}
            className="mt-6 py-3 border border-white/20 hover:border-white/50 bg-white/5 hover:bg-white/10 transition-all rounded text-xs tracking-[0.3em] font-light"
          >
            扰 动 波 函 数 (重新抽牌)
          </button>
        )}
      </div>
    </div>
  );
}
