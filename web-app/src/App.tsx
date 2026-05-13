import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import TarotCard from "./components/TarotCard";
import Effects from "./components/Effects";
import SettingsPanel from "./components/SettingsPanel";
import InterpretationPanel from "./components/InterpretationPanel";
import QuestionInput from "./components/QuestionInput";
import { drawRandomCards } from "./data/tarotData";
import { DEFAULT_SPREAD_ID, getSpreadById, SPREAD_PRESETS } from "./data/spreads";
import { fetchSpreadInterpretation } from "./services/llm";

type DrawnSpreadCard = {
  id: string;
  title: string;
  name: string;
  meaning: string;
  img: string;
  reversed: boolean;
};

function createEmptySpread(spreadId: string) {
  return getSpreadById(spreadId).slots.map(() => null) as Array<DrawnSpreadCard | null>;
}

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSpreadId, setActiveSpreadId] = useState(DEFAULT_SPREAD_ID);
  const activeSpread = useMemo(() => getSpreadById(activeSpreadId), [activeSpreadId]);
  const [drawnCards, setDrawnCards] = useState<Array<DrawnSpreadCard | null>>(() => createEmptySpread(DEFAULT_SPREAD_ID));
  const [interpretation, setInterpretation] = useState("");
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");
  const [isQuestionLocked, setIsQuestionLocked] = useState(false);

  const nextCardIndex = drawnCards.findIndex((card) => card === null);
  const hasStartedDraw = drawnCards.some(Boolean);
  const isSpreadComplete = drawnCards.length > 0 && drawnCards.every(Boolean);

  const spreadReadingCards = activeSpread.slots
    .map((slot, index) => {
      const card = drawnCards[index];
      if (!card) {
        return null;
      }

      return {
        slotLabel: slot.label,
        slotHint: slot.hint,
        card,
      };
    })
    .filter(Boolean) as Array<{ slotLabel: string; slotHint: string; card: DrawnSpreadCard }>;

  const handleQuestionSubmit = (question: string) => {
    setUserQuestion(question);
    setIsQuestionLocked(true);
  };

  const handleSpreadChange = (spreadId: string) => {
    if (isQuestionLocked || hasStartedDraw) {
      return;
    }

    setActiveSpreadId(spreadId);
    setDrawnCards(createEmptySpread(spreadId));
    setInterpretation("");
  };

  const handleDraw = async (cardIndex: number) => {
    if (!isQuestionLocked || isInterpreting) return;
    if (cardIndex !== nextCardIndex || cardIndex === -1) return;

    const excludedIds = drawnCards.filter(Boolean).map((card) => card!.id);
    const [nextCard] = drawRandomCards(1, excludedIds);
    if (!nextCard) return;

    const nextDrawnCards = [...drawnCards];
    nextDrawnCards[cardIndex] = nextCard;
    setDrawnCards(nextDrawnCards);

    if (!nextDrawnCards.every(Boolean)) {
      return;
    }

    setIsInterpreting(true);

    const saved = localStorage.getItem("quantum_tarot_config");
    let config = null;
    if (saved) {
      try {
        config = JSON.parse(saved);
      } catch {
        config = null;
      }
    }

    if (!config || !config.apiKey) {
      setInterpretation("[系统反馈]：观测源断开。请点击右上角【终端配置】输入心智密钥（API Key）。");
      setIsInterpreting(false);
      return;
    }

    const readingCards = activeSpread.slots.map((slot, index) => ({
      slotLabel: slot.label,
      slotHint: slot.hint,
      card: nextDrawnCards[index]!,
    }));

    const result = await fetchSpreadInterpretation(readingCards, userQuestion, config, activeSpread.name);
    setInterpretation(result);
    setIsInterpreting(false);
  };

  const handleClear = () => {
    setInterpretation("");
    setUserQuestion("");
    setIsQuestionLocked(false);
    setDrawnCards(createEmptySpread(activeSpreadId));
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0907] text-[#f5eee1]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(210,164,94,0.18),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(113,77,44,0.18),_transparent_28%),linear-gradient(180deg,_#16110d_0%,_#0f0b08_45%,_#080605_100%)]" />
      <div className="paper-grain pointer-events-none absolute inset-0 opacity-40" />

      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-5 md:px-8 md:py-7">
        <div className="rounded-full border border-[#9f7a43]/20 bg-[#221912]/60 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-[#d5bd8d] shadow-[0_0_24px_rgba(175,126,68,0.08)] backdrop-blur-xl">
          Quantum Tarot Interface
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-3 rounded-full border border-[#9f7a43]/18 bg-[#140f0c]/70 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-[#dcc59a] backdrop-blur-xl transition hover:border-[#c79a56]/40 hover:bg-[#231811]/80 hover:text-[#f4e5c5]"
        >
          <span className="h-2 w-2 rounded-full bg-[#e3c07b] shadow-[0_0_16px_rgba(227,192,123,0.95)]" />
          模型接口
        </button>
      </header>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-3 py-20 md:px-8">
        <section className="relative h-[88vh] min-h-[720px] w-full max-w-[1480px] overflow-hidden rounded-[32px] border border-[#8f6d41]/18 bg-[#0f0c09]/45 shadow-[0_40px_140px_rgba(0,0,0,0.68)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(240,215,165,0.08),_transparent_34%),linear-gradient(135deg,rgba(255,245,224,0.06),transparent_24%,transparent_74%,rgba(185,138,80,0.06))]" />

          <div className="absolute inset-0 z-0 transition-opacity duration-1000">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
              <Effects />
              {activeSpread.slots.map((slot, index) => (
                <TarotCard
                  key={slot.id}
                  drawnCard={drawnCards[index]}
                  onDraw={() => handleDraw(index)}
                  isFlipped={Boolean(drawnCards[index])}
                  isActivated={isQuestionLocked}
                  isClickable={index === nextCardIndex}
                  slotLabel={slot.label}
                  basePosition={slot.position}
                  baseRotationZ={slot.rotationZ}
                  cardScale={slot.scale}
                />
              ))}
            </Canvas>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-full max-w-[560px] p-6 md:p-10">
            <div className="max-w-[460px] rounded-[28px] border border-[#a07a46]/16 bg-[linear-gradient(180deg,rgba(31,22,16,0.86),rgba(18,13,10,0.82))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl md:p-8">
              <p className="text-[11px] uppercase tracking-[0.4em] text-[#d8bc88]">Nonlinear Reading Engine</p>
              <h1 className="mt-4 font-serif text-5xl font-semibold leading-none text-[#f8efdc] md:text-7xl">
                Quantum Tarot
              </h1>
              <p className="mt-5 text-sm leading-7 text-[#d5c6ac] md:text-[15px]">
                这不是一个把牌义贴给你的占卜页，而是把问题、卡面与未来牵引感放在同一张界面里。你先给出意图，系统再允许你触碰坍缩。
              </p>

              <div className="mt-7 space-y-3">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#b89968]">Spread Selection</p>
                <div className="flex flex-wrap gap-2">
                  {SPREAD_PRESETS.map((spread) => (
                    <button
                      key={spread.id}
                      type="button"
                      onClick={() => handleSpreadChange(spread.id)}
                      className={`pointer-events-auto rounded-full border px-3 py-2 text-xs uppercase tracking-[0.18em] transition ${activeSpreadId === spread.id ? 'border-[#d8ae70]/38 bg-[#392514] text-[#f8e6c0]' : 'border-[#9e7947]/20 bg-[#271c14]/70 text-[#d9c49a] hover:border-[#c79a56]/40'} ${isQuestionLocked || hasStartedDraw ? 'opacity-50' : ''}`}
                    >
                      {spread.name}
                    </button>
                  ))}
                </div>
                <p className="text-sm leading-6 text-[#cdb999]">{activeSpread.summary}</p>
              </div>

              <div className="mt-7 flex flex-wrap gap-3 text-xs tracking-[0.16em] text-[#d9c49a]">
                <span className="rounded-full border border-[#9e7947]/20 bg-[#271c14]/70 px-3 py-2">Three.js 粒子场</span>
                <span className="rounded-full border border-[#9e7947]/20 bg-[#271c14]/70 px-3 py-2">大模型解牌</span>
                <span className="rounded-full border border-[#9e7947]/20 bg-[#271c14]/70 px-3 py-2">正逆位动态呈现</span>
              </div>

              <div className="mt-8 rounded-2xl border border-[#8f6d41]/18 bg-[#19120e]/85 p-4">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#b89968]">Current Ritual State</p>
                <p className="mt-3 text-sm leading-6 text-[#e0d1b6]">
                  {isSpreadComplete
                    ? "整组牌已经完成坍缩。右侧面板正在按牌位展开本轮解读。"
                    : hasStartedDraw && nextCardIndex >= 0
                      ? `牌阵已开始展开。继续点击第 ${nextCardIndex + 1} 张牌，直到整组牌全部显现。`
                      : isQuestionLocked
                        ? `意图已锁定：${userQuestion}`
                        : "先写下真正的问题，再去点击中央悬浮的卡牌。"}
                </p>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-6 left-6 z-10 hidden rounded-2xl border border-[#8f6d41]/18 bg-[#130f0c]/75 p-4 text-[11px] uppercase tracking-[0.24em] text-[#b89968] backdrop-blur-xl md:block">
            01 锁定问题 · 02 依次翻牌 · 03 查看分位解读
          </div>

          <div className={`absolute inset-x-0 bottom-6 z-20 flex justify-center px-4 transition-all duration-700 ${hasStartedDraw ? "translate-y-10 opacity-0" : "translate-y-0 opacity-100"}`}>
            <QuestionInput onSubmit={handleQuestionSubmit} isVisible={!isQuestionLocked && !hasStartedDraw} />
          </div>

          {isQuestionLocked && !hasStartedDraw && (
            <div className="pointer-events-none absolute bottom-28 left-1/2 z-20 -translate-x-1/2 rounded-full border border-[#b28643]/25 bg-[#2c1d0d]/90 px-5 py-3 text-xs tracking-[0.28em] text-[#efd6a0] shadow-[0_0_40px_rgba(178,134,67,0.16)]">
              意图已锁定，点击第 1 张牌开始展开 {activeSpread.name}
            </div>
          )}

          <div className={`absolute inset-y-0 right-0 z-20 w-full max-w-[620px] transition-all duration-1000 ${isSpreadComplete || isInterpreting ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}`}>
            {spreadReadingCards.length > 0 && (
              <InterpretationPanel
                cards={spreadReadingCards}
                spreadName={activeSpread.name}
                spreadSummary={activeSpread.summary}
                text={interpretation}
                isThinking={isInterpreting}
                onClear={handleClear}
              />
            )}
          </div>
        </section>
      </main>

      {isSettingsOpen && <SettingsPanel onClose={() => setIsSettingsOpen(false)} />}
    </div>
  );
}

export default App;
