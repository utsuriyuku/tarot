import { useState, useEffect } from "react";
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
    <div className="w-screen h-screen bg-black relative font-sans overflow-hidden">
      {/* 终端配置按钮 */} 
      <button 
        onClick={() => setIsSettingsOpen(true)}
        className="absolute top-8 right-8 z-50 text-white/30 hover:text-white/90 tracking-widest text-xs font-light transition-all duration-300 backdrop-blur-sm px-4 py-2 border border-transparent hover:border-white/20 rounded-full flex items-center gap-2"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-white/50 inline-block animate-pulse"></span>
        终端配置
      </button>

      {/* 顶部标题与引导文案 */}
      <div className={`absolute top-0 left-0 w-full h-[30%] pointer-events-none z-10 flex flex-col items-center justify-end p-8 transition-all duration-1000 ${isFlipped ? "opacity-0 -translate-y-10" : "opacity-100"}`}>
        <h1 className="text-[2.5rem] font-extralight tracking-[0.4em] text-white/90 select-none uppercase blur-[0.3px]">
          Quantum Tarot
        </h1>
        <p className="mt-6 text-white/40 tracking-[0.2em] text-[0.85rem] font-light flex flex-col items-center gap-1">
          <span>「时间失去刻度，抽取即是未来向此刻的投射」</span>
          {isQuestionLocked ? (
            <span className="text-white/60 text-xs mt-4 animate-pulse">意念已锁定。点击悬浮卡面，触碰量子坍缩。</span>
          ) : (
            <span className="text-white/20 text-xs mt-4">请于下方凝聚你的意图</span>
          )}
        </p>
      </div>

      {/* 意念输入组件 */}
      <QuestionInput 
        onSubmit={handleQuestionSubmit} 
        isVisible={!isQuestionLocked && !isFlipped}
      />

      {/* 3D 渲染层 */}
      <div className={`w-full h-full z-0 transition-opacity duration-1000 ${isQuestionLocked ? "opacity-100 cursor-pointer" : "opacity-30 pointer-events-none hover:cursor-not-allowed"}`}>
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <Effects />
          <TarotCard drawnCard={drawnCard} onDraw={handleDraw} isFlipped={isFlipped} />
        </Canvas>
      </div>

      {/* 解牌面板 */}
      <div className={`transition-all duration-1000 pointer-events-none ${isFlipped ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[400px]"}`}>
        {drawnCard && (
          <InterpretationPanel 
            card={drawnCard}
            text={interpretation}
            isThinking={isInterpreting}
            onClear={handleClear}
          />
        )}
      </div>

      {/* 设置面板 */}
      {isSettingsOpen && (
        <SettingsPanel onClose={() => setIsSettingsOpen(false)} />
      )}
    </div>
  );
}

