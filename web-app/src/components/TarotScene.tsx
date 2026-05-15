import { useCallback, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Effects from "./Effects";
import TarotCard from "./TarotCard";

type DrawnSpreadCard = {
  id: string;
  title: string;
  name: string;
  meaning: string;
  img: string;
  reversed: boolean;
};

type SceneSlot = {
  id: string;
  label: string;
  hint: string;
  position: [number, number, number];
  rotationZ: number;
  scale: number;
};

type TarotSceneProps = {
  cameraConfig: {
    position: [number, number, number];
    fov: number;
  };
  slots: SceneSlot[];
  drawnCards: Array<DrawnSpreadCard | null>;
  isQuestionLocked: boolean;
  nextCardIndex: number;
  onDraw: (cardIndex: number) => void;
};

function FallbackTarotStage({
  slots,
  drawnCards,
  isQuestionLocked,
  nextCardIndex,
  onDraw,
}: Pick<TarotSceneProps, 'slots' | 'drawnCards' | 'isQuestionLocked' | 'nextCardIndex' | 'onDraw'>) {
  const layoutClassName = slots.length === 1
    ? 'grid-cols-1 max-w-[260px]'
    : slots.length === 3
      ? 'grid-cols-1 md:grid-cols-3 max-w-[920px]'
      : 'grid-cols-2 md:grid-cols-3 max-w-[980px]';

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center px-4 pb-24 pt-28 md:justify-end md:px-10 md:pb-10 md:pl-[430px] md:pr-16">
      <div className="w-full">
        <div className="mb-4 flex justify-center md:justify-start">
          <div className="rounded-full border border-[#9e7947]/20 bg-[#17110d]/88 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-[#d7bd8d] backdrop-blur-xl">
            WebGL 已降级，切换为简化抽牌模式
          </div>
        </div>
        <div className={`mx-auto grid w-full gap-4 ${layoutClassName}`}>
          {slots.map((slot, index) => {
            const drawnCard = drawnCards[index];
            const isClickable = isQuestionLocked && index === nextCardIndex;

            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => onDraw(index)}
                disabled={!isClickable}
                className={`group relative min-h-[240px] overflow-hidden rounded-[28px] border px-5 py-6 text-left transition ${drawnCard ? 'border-[#d0a96f]/34 bg-[linear-gradient(180deg,rgba(54,37,22,0.96),rgba(24,17,12,0.96))] text-[#f5e8cd]' : isClickable ? 'border-[#d0a96f]/34 bg-[linear-gradient(180deg,rgba(42,29,18,0.94),rgba(20,14,10,0.94))] text-[#f5e8cd] hover:-translate-y-1 hover:border-[#e2bc82]/54 hover:shadow-[0_18px_40px_rgba(0,0,0,0.35)]' : 'border-[#8f6d41]/18 bg-[linear-gradient(180deg,rgba(24,18,14,0.9),rgba(14,10,8,0.92))] text-[#a98b63]'} ${slots.length === 5 && index === 2 ? 'col-span-2 md:col-span-1' : ''}`}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(231,198,135,0.1),transparent_36%),linear-gradient(180deg,transparent,rgba(0,0,0,0.16))] opacity-80" />
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#c7a66d]">{slot.label}</p>
                    <p className="mt-3 text-sm leading-6 text-inherit/85">{slot.hint}</p>
                  </div>

                  <div className="mt-8 rounded-[22px] border border-white/8 bg-black/16 px-4 py-5 text-center backdrop-blur-sm">
                    {drawnCard ? (
                      <>
                        <p className="text-xs uppercase tracking-[0.24em] text-[#d8bb89]">{drawnCard.reversed ? '逆位' : '正位'}</p>
                        <p className="mt-3 text-2xl font-serif text-[#fff4de]">{drawnCard.name}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#c4a677]">{drawnCard.title}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-[11px] uppercase tracking-[0.34em] text-[#c7a66d]">Quantum Card</p>
                        <p className="mt-4 text-xl font-serif text-[#f1dfbf]">{isClickable ? '点击翻牌' : '等待展开'}</p>
                        <p className="mt-3 text-xs tracking-[0.16em] text-[#a98b63]">
                          {isQuestionLocked ? (isClickable ? '当前可点击' : `请先完成第 ${nextCardIndex + 1} 张牌`) : '先锁定问题'}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function TarotScene({ cameraConfig, slots, drawnCards, isQuestionLocked, nextCardIndex, onDraw }: TarotSceneProps) {
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  const handleCreated = useCallback((state: { gl: HTMLCanvasElement | any }) => {
    const canvas = state.gl.domElement as HTMLCanvasElement;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setIsFallbackMode(true);
    };

    canvas.addEventListener('webglcontextlost', handleContextLost, { once: true });
  }, []);

  if (isFallbackMode) {
    return (
      <div className="relative h-full w-full bg-[radial-gradient(circle_at_center,rgba(240,215,165,0.08),transparent_34%),linear-gradient(180deg,#120d09_0%,#0c0907_100%)]">
        <FallbackTarotStage
          slots={slots}
          drawnCards={drawnCards}
          isQuestionLocked={isQuestionLocked}
          nextCardIndex={nextCardIndex}
          onDraw={onDraw}
        />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full bg-[radial-gradient(circle_at_center,rgba(240,215,165,0.06),transparent_34%),linear-gradient(180deg,#120d09_0%,#0c0907_100%)]">
      <Canvas
        camera={cameraConfig}
        dpr={[1, 1.25]}
        gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
        onCreated={handleCreated}
      >
        <Effects />
        {slots.map((slot, index) => (
          <TarotCard
            key={slot.id}
            drawnCard={drawnCards[index]}
            onDraw={() => onDraw(index)}
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
  );
}