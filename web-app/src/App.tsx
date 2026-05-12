import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import TarotCard from "./components/TarotCard";
import Effects from "./components/Effects";
import SettingsPanel from "./components/SettingsPanel";
import InterpretationPanel from "./components/InterpretationPanel";
import QuestionInput from "./components/QuestionInput";
import { getRandomCard } from "./data/tarotData";
import { fetchQuantumInterpretation } from "./services/llm";

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [drawnCard, setDrawnCard] = useState<any>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [interpretation, setInterpretation] = useState("");
  const [isInterpreting, setIsInterpreting] = useState(false);
  
  // 新状态：用户的提问
  const [userQuestion, setUserQuestion] = useState("");
  const [isQuestionLocked, setIsQuestionLocked] = useState(false);

  const handleQuestionSubmit = (q: string) => {
    setUserQuestion(q);
    setIsQuestionLocked(true);
    // 用户提交问题后，仍需点击牌面来触发坍缩抽牌
  };

  const handleDraw = async () => {
    if (isFlipped) return; // 已经翻转则拦截
    if (!isQuestionLocked) return; // 必须先锁定问题才能抽牌

    const card = getRandomCard();
    setDrawnCard(card);
    setIsFlipped(true);
    setIsInterpreting(true);

    const saved = localStorage.getItem("quantum_tarot_config");
    let config = null;
    if (saved) {
      try { config = JSON.parse(saved); } catch (e) {}
    }

    if (!config || !config.apiKey) {
      setInterpretation("[系统反馈]：观测源断开。请点击右上角【终端配置】输入心智密钥（API Key）。");
      setIsInterpreting(false);
      return;
    }

    const result = await fetchQuantumInterpretation(card, userQuestion, config);
    setInterpretation(result);
    setIsInterpreting(false);
  };

  const handleClear = () => {
    setIsFlipped(false);
    setInterpretation("");
    setUserQuestion("");
    setIsQuestionLocked(false);
    setTimeout(() => setDrawnCard(null), 500);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#04050a] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(89,118,255,0.16),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(0,181,173,0.16),_transparent_30%),linear-gradient(180deg,_#06070d_0%,_#04050a_48%,_#020308_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:96px_96px] [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]" />

      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-5 md:px-8 md:py-7">
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-white/55 backdrop-blur-xl">
          Quantum Tarot Interface
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-3 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/70 backdrop-blur-xl transition hover:border-white/25 hover:bg-white/10 hover:text-white"
        >
          <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(103,232,249,0.95)]" />
          模型接口
        </button>
      </header>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-3 py-20 md:px-8">
        <section className="relative h-[88vh] min-h-[720px] w-full max-w-[1480px] overflow-hidden rounded-[32px] border border-white/10 bg-black/20 shadow-[0_40px_140px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.06),_transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_24%,transparent_76%,rgba(255,255,255,0.04))]" />

          <div className="absolute inset-0 z-0 transition-opacity duration-1000">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
              <Effects />
              <TarotCard drawnCard={drawnCard} onDraw={handleDraw} isFlipped={isFlipped} />
            </Canvas>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-full max-w-[560px] p-6 md:p-10">
            <div className="max-w-[460px] rounded-[28px] border border-white/10 bg-black/28 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-8">
              <p className="text-[11px] uppercase tracking-[0.4em] text-cyan-200/70">Nonlinear Reading Engine</p>
              <h1 className="mt-4 font-serif text-5xl font-semibold leading-none text-white md:text-7xl">
                Quantum Tarot
              </h1>
              <p className="mt-5 text-sm leading-7 text-white/72 md:text-[15px]">
                这不是一个把牌义贴给你的占卜页，而是把问题、卡面与未来牵引感放在同一张界面里。你先给出意图，系统再允许你触碰坍缩。
              </p>

              <div className="mt-7 flex flex-wrap gap-3 text-xs tracking-[0.16em] text-white/70">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">Three.js 粒子场</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">大模型解牌</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2">正逆位动态呈现</span>
              </div>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Current Ritual State</p>
                <p className="mt-3 text-sm leading-6 text-white/78">
                  {isFlipped
                    ? "牌面已坍缩。右侧面板正在给出本轮解读。"
                    : isQuestionLocked
                      ? `意图已锁定：${userQuestion}`
                      : "先写下真正的问题，再去点击中央悬浮的卡牌。"}
                </p>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-6 left-6 z-10 hidden rounded-2xl border border-white/10 bg-black/30 p-4 text-[11px] uppercase tracking-[0.24em] text-white/45 backdrop-blur-xl md:block">
            01 锁定问题 · 02 触碰卡面 · 03 等待解牌
          </div>

          <div className={`absolute inset-x-0 bottom-6 z-20 flex justify-center px-4 transition-all duration-700 ${isFlipped ? "translate-y-10 opacity-0" : "translate-y-0 opacity-100"}`}>
            <QuestionInput
              onSubmit={handleQuestionSubmit}
              isVisible={!isQuestionLocked && !isFlipped}
            />
          </div>

          {isQuestionLocked && !isFlipped && (
            <div className="pointer-events-none absolute bottom-28 left-1/2 z-20 -translate-x-1/2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-5 py-3 text-xs tracking-[0.28em] text-cyan-100 shadow-[0_0_40px_rgba(34,211,238,0.2)]">
              意图已锁定，点击卡牌开始本轮观测
            </div>
          )}

          <div className={`absolute inset-y-0 right-0 z-20 w-full max-w-[460px] transition-all duration-1000 ${isFlipped ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}`}>
            {drawnCard && (
              <InterpretationPanel
                card={drawnCard}
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
