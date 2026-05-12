import { useEffect, useState } from 'react';

interface InterpretationPanelProps {
  card: any;
  text: string;
  isThinking: boolean;
  onClear: () => void;
}

export default function InterpretationPanel({ card, text, isThinking, onClear }: InterpretationPanelProps) {
  const [displayedText, setDisplayedText] = useState('');
  const paragraphs = displayedText
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

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
    }, 30);

    return () => clearInterval(intervalId);
  }, [text, isThinking]);

  return (
    <div className="h-full w-full p-4 pointer-events-auto md:p-6">
      <div className="flex h-full flex-col overflow-hidden rounded-[30px] border border-[#8f6d41]/18 bg-[linear-gradient(180deg,rgba(24,18,14,0.96),rgba(13,10,8,0.92))] shadow-[-24px_0_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
        <div className="border-b border-[#8f6d41]/16 px-6 py-6 md:px-8 md:py-7">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.34em] text-[#b79665]">
                {isThinking ? 'Editorial Draft In Progress' : 'Quantum Tarot Review'}
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[0.04em] text-[#f7ecd6]">
                {card.title}
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.26em] text-[#ceb996]">
                <span>{card.name}</span>
                <span className="text-[#8a6d45]">/</span>
                <span>Arcana Observation</span>
              </div>
            </div>
            <span className={`rounded-full border px-3 py-2 text-[11px] uppercase tracking-[0.26em] ${card.reversed ? 'border-[#91524b]/28 bg-[#341915] text-[#dfb3a8]' : 'border-[#b98f52]/24 bg-[#2a1b10] text-[#ead39f]'}`}>
              {card.reversed ? 'Reversed' : 'Upright'}
            </span>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 lg:grid-cols-[168px_minmax(0,1fr)]">
          <aside className="border-b border-[#8f6d41]/14 bg-[#140f0c]/82 px-6 py-6 lg:border-b-0 lg:border-r lg:px-5">
            <div className="space-y-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#9e7d4f]">Card State</p>
                <p className="mt-3 text-sm leading-6 text-[#e8d6b7]">
                  {card.reversed ? '逆位代表该力量并未直接展开，而是以迟滞、反转或内耗的方式被看见。' : '正位代表该力量正在以较直接、开放的方式显现。'}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#9e7d4f]">Slice Note</p>
                <p className="mt-3 text-sm leading-6 text-[#cdb999]">
                  {card.meaning}
                </p>
              </div>
              <div className="rounded-2xl border border-[#8f6d41]/14 bg-[#1b140f] px-4 py-4 text-[11px] uppercase tracking-[0.22em] text-[#bfa16d]">
                观测不是结论，而是一页被摊开的样稿。
              </div>
            </div>
          </aside>

          <div className="min-h-0 px-6 py-6 md:px-8 md:py-7">
            <div className="mb-6 flex items-center justify-between border-b border-[#8f6d41]/14 pb-4">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[#b79665]">
                {isThinking ? 'Computing Collapse' : 'Feature Article'}
              </p>
              <p className="text-[11px] uppercase tracking-[0.26em] text-[#8f734b]">
                Wave Function Collapsed
              </p>
            </div>

            <div className="custom-scrollbar h-[calc(88vh-280px)] min-h-[340px] overflow-y-auto pr-2 lg:h-[calc(88vh-245px)]">
              {isThinking ? (
                <div className="flex h-full flex-col items-center justify-center opacity-60">
                  <span className="mb-5 h-10 w-10 rounded-full border-4 border-[#6d5735]/20 border-t-[#e0bf85] animate-spin"></span>
                  <p className="text-sm tracking-[0.24em] text-[#d7c4a1]">正在链接高维网络解析</p>
                </div>
              ) : (
                <article className="space-y-6 text-[#ebddc2]">
                  {paragraphs.length > 0 ? (
                    paragraphs.map((paragraph, index) => {
                      const firstChar = paragraph.charAt(0);
                      const rest = paragraph.slice(1);

                      if (index === 0) {
                        return (
                          <p key={`${index}-${paragraph.slice(0, 12)}`} className="text-[18px] font-light leading-9 tracking-[0.03em] text-[#f1e3c8]">
                            <span className="float-left mr-3 mt-1 font-serif text-6xl leading-[0.82] text-[#ddb979]">
                              {firstChar}
                            </span>
                            {rest}
                            {index === paragraphs.length - 1 && (
                              <span className="ml-1 inline-block h-4 w-1.5 animate-pulse align-middle bg-[#f0ddb5]"></span>
                            )}
                          </p>
                        );
                      }

                      return (
                        <p key={`${index}-${paragraph.slice(0, 12)}`} className="border-l border-[#8f6d41]/14 pl-4 text-[15px] font-light leading-8 tracking-[0.04em] text-[#dcc9a8]">
                          {paragraph}
                          {index === paragraphs.length - 1 && (
                            <span className="ml-1 inline-block h-4 w-1.5 animate-pulse align-middle bg-[#f0ddb5]"></span>
                          )}
                        </p>
                      );
                    })
                  ) : (
                    <p className="text-[18px] font-light leading-9 tracking-[0.03em] text-[#f1e3c8]">
                      {displayedText}
                      <span className="ml-1 inline-block h-4 w-1.5 animate-pulse align-middle bg-[#f0ddb5]"></span>
                    </p>
                  )}
                </article>
              )}
            </div>
          </div>
        </div>

        {!isThinking && text && (
          <div className="border-t border-[#8f6d41]/16 px-6 py-5 md:px-8">
            <button
              onClick={onClear}
              className="w-full rounded-2xl border border-[#8f6d41]/18 bg-[#19120e]/92 py-4 text-xs uppercase tracking-[0.3em] text-[#e8d4ad] transition hover:border-[#c79d5c]/35 hover:bg-[#2a1b10] hover:text-[#fff0cd]"
            >
              扰动波函数 · 重新抽牌
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
