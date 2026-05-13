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

export default function TarotScene({ cameraConfig, slots, drawnCards, isQuestionLocked, nextCardIndex, onDraw }: TarotSceneProps) {
  return (
    <Canvas camera={cameraConfig}>
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
  );
}