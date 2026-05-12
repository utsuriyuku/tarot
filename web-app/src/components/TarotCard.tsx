import { useRef, useState, Suspense } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Text, useCursor } from "@react-three/drei";
import * as THREE from "three";

type TarotCardProps = {
  drawnCard: any;
  onDraw: () => void;
  isFlipped: boolean;
};

// 独立的纹理加载组件，利用 Suspense 处理异步加载
function CardFrontImage({ url }: { url: string }) {
  const texture = useLoader(THREE.TextureLoader, url);
  return (
    <mesh position={[0, 0, 0.03]} rotation={[0, 0, 0]}>
      <planeGeometry args={[2.3, 3.8]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

export default function TarotCard({ drawnCard, onDraw, isFlipped }: TarotCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useCursor(hovered);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    const targetRotation = isFlipped ? Math.PI : 0;
    const targetY = isFlipped ? Math.sin(state.clock.elapsedTime * 2) * 0.05 + 0.5 : Math.sin(state.clock.elapsedTime) * 0.1;
    const targetZ = isFlipped ? 2 : 0;

    meshRef.current.rotation.y += (targetRotation - meshRef.current.rotation.y) * delta * 5;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * delta * 5;
    meshRef.current.position.z += (targetZ - meshRef.current.position.z) * delta * 2;
    
    if (isFlipped && drawnCard?.reversed) {
      const targetReversedRot = isFlipped ? Math.PI : 0;
      meshRef.current.rotation.z += (targetReversedRot - meshRef.current.rotation.z) * delta * 3;
    } else {
      meshRef.current.rotation.z += (0 - meshRef.current.rotation.z) * delta * 3;
    }
  });

  return (
    <group>
      <mesh 
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onDraw}
      >
        <boxGeometry args={[2.5, 4, 0.05]} />
        <meshStandardMaterial 
          color={isFlipped ? "#21160f" : "#120d09"} 
          roughness={0.2} 
          metalness={0.7} 
        />
        
        {/* 卡背: 保持原本的文本图案 */}
        <Text 
          position={[0, 0, 0.03]} 
          fontSize={0.25} 
          color="#e4bf7d"
          maxWidth={2}
          textAlign="center"
        >
          QUANTUM
        </Text>
        
        {/* 卡面：翻转后展示，带有一点厚度偏移Z轴以免与盒子重叠 (-0.03) */}
        {drawnCard && (
          <group position={[0, 0, -0.03]} rotation={[0, Math.PI, 0]}>
            <Suspense fallback={
              <Text position={[0, 0, 0.03]} fontSize={0.2} color="#ffffff">
                LOADING COLLAPSE...
              </Text>
            }>
              {drawnCard.img && <CardFrontImage url={drawnCard.img} />}
            </Suspense>
          </group>
        )}
      </mesh>
      
      <pointLight position={[0, 0, 2]} intensity={1.4} color="#d7b274" />
      <pointLight position={[0, 0, -2]} intensity={1.2} color="#8b5c39" />
    </group>
  );
}

