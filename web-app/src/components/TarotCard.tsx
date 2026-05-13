import { useEffect, useRef, useState, Suspense } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Text, useCursor } from "@react-three/drei";
import * as THREE from "three";

type TarotCardProps = {
  drawnCard: any;
  onDraw: () => void;
  isFlipped: boolean;
  isActivated: boolean;
  isClickable?: boolean;
  slotLabel?: string;
  basePosition?: [number, number, number];
  baseRotationZ?: number;
  cardScale?: number;
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

export default function TarotCard({
  drawnCard,
  onDraw,
  isFlipped,
  isActivated,
  isClickable = true,
  slotLabel,
  basePosition = [0, 0, 0],
  baseRotationZ = 0,
  cardScale = 1,
}: TarotCardProps) {
  const stageRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const auraInnerRef = useRef<THREE.Mesh>(null);
  const auraOuterRef = useRef<THREE.Mesh>(null);
  const runeRingRef = useRef<THREE.Mesh>(null);
  const frontLightRef = useRef<THREE.PointLight>(null);
  const backLightRef = useRef<THREE.PointLight>(null);
  const [hovered, setHovered] = useState(false);
  const burstRef = useRef(0);
  const activationPulseRef = useRef(0);

  useCursor(hovered && isActivated && isClickable);

  useEffect(() => {
    if (isActivated) {
      activationPulseRef.current = 1;
    }
  }, [isActivated]);

  const handleCardClick = () => {
    if (!isActivated || isFlipped || !isClickable) {
      return;
    }
    burstRef.current = 1;
    onDraw();
  };

  useFrame((state, delta) => {
    if (!meshRef.current || !stageRef.current) return;

    burstRef.current = Math.max(0, burstRef.current - delta * 1.8);
    activationPulseRef.current = Math.max(0, activationPulseRef.current - delta * 0.85);

    const baseScale = isActivated ? cardScale : cardScale * 0.72;
    const entranceX = basePosition[0];
    const entranceY = isActivated ? basePosition[1] : basePosition[1] - 2.4;
    const entranceZ = isActivated ? basePosition[2] : basePosition[2] - 2.8;
    const entranceRotX = isActivated ? 0 : 0.45;
    const entranceRotZ = isActivated ? baseRotationZ : baseRotationZ - 0.24;
    const hoverLift = hovered && isActivated && !isFlipped ? 0.22 : 0;

    const stageScale = baseScale + burstRef.current * 0.12 + activationPulseRef.current * 0.08;
    stageRef.current.scale.x += (stageScale - stageRef.current.scale.x) * delta * 4;
    stageRef.current.scale.y += (stageScale - stageRef.current.scale.y) * delta * 4;
    stageRef.current.scale.z += (stageScale - stageRef.current.scale.z) * delta * 4;
    stageRef.current.position.x += (entranceX - stageRef.current.position.x) * delta * 4;
    stageRef.current.position.y += (entranceY + hoverLift - stageRef.current.position.y) * delta * 4;
    stageRef.current.position.z += (entranceZ - stageRef.current.position.z) * delta * 3.2;
    stageRef.current.rotation.x += (entranceRotX - stageRef.current.rotation.x) * delta * 3.2;
    stageRef.current.rotation.z += (entranceRotZ - stageRef.current.rotation.z) * delta * 3.2;

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

    const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 1.7) * 0.5;
    const glowStrength = (isActivated ? 0.28 : 0.08) + (hovered && isClickable ? 0.16 : 0) + burstRef.current * 0.65 + activationPulseRef.current * 0.42;

    if (auraInnerRef.current) {
      auraInnerRef.current.scale.setScalar(1.05 + glowStrength * 0.55 + pulse * 0.03);
      const material = auraInnerRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = Math.min(0.52, glowStrength * 0.42);
    }

    if (auraOuterRef.current) {
      auraOuterRef.current.scale.setScalar(1.2 + glowStrength * 0.92 + pulse * 0.08);
      auraOuterRef.current.rotation.z += delta * 0.14;
      const material = auraOuterRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = Math.min(0.28, glowStrength * 0.18 + pulse * 0.04);
    }

    if (runeRingRef.current) {
      runeRingRef.current.rotation.z += delta * (hovered ? 0.95 : 0.42);
      runeRingRef.current.scale.setScalar(1 + glowStrength * 0.14);
      const material = runeRingRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = Math.min(0.38, (isActivated ? 0.12 : 0) + glowStrength * 0.14);
    }

    if (frontLightRef.current) {
      frontLightRef.current.intensity = THREE.MathUtils.lerp(frontLightRef.current.intensity, 1.2 + glowStrength * 2.4, delta * 4.2);
    }

    if (backLightRef.current) {
      backLightRef.current.intensity = THREE.MathUtils.lerp(backLightRef.current.intensity, 0.9 + glowStrength * 1.6, delta * 4.2);
    }
  });

  return (
    <group ref={stageRef}>
      <mesh ref={auraOuterRef} position={[0, 0, -0.2]}>
        <planeGeometry args={[4.9, 6.9]} />
        <meshBasicMaterial color="#b98d50" transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      <mesh ref={auraInnerRef} position={[0, 0, -0.12]}>
        <planeGeometry args={[3.4, 4.95]} />
        <meshBasicMaterial color="#f0d5a1" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      <mesh ref={runeRingRef} position={[0, 0, -0.08]}>
        <ringGeometry args={[2.08, 2.2, 96]} />
        <meshBasicMaterial color="#d5ab6c" transparent opacity={0.12} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      <mesh 
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleCardClick}
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

        {slotLabel && (
          <Text
            position={[0, -2.55, 0.03]}
            fontSize={0.13}
            color={isClickable && isActivated && !isFlipped ? '#f3d7a2' : '#b28d5c'}
            maxWidth={4}
            textAlign="center"
          >
            {slotLabel}
          </Text>
        )}
        
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
      
      <pointLight ref={frontLightRef} position={[0, 0, 2]} intensity={1.4} color="#d7b274" />
      <pointLight ref={backLightRef} position={[0, 0, -2]} intensity={1.2} color="#8b5c39" />
    </group>
  );
}

