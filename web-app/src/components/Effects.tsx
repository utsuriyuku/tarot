import { Stars, Sparkles, Float } from '@react-three/drei';

export default function Effects() {
  return (
    <>
      <color attach="background" args={['#0a0807']} />
      <fog attach="fog" args={['#0a0807', 8, 24]} />

      <Stars
        radius={18}
        depth={90}
        count={900}
        factor={2.8}
        saturation={0}
        fade
        speed={0.55}
      />

      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sparkles
          count={28}
          scale={10}
          size={2.1}
          speed={0.24}
          opacity={0.26}
          color="#ead3a2"
        />
      </Float>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1}>
        <Sparkles
          count={16}
          scale={8}
          size={2.8}
          speed={0.14}
          opacity={0.12}
          color="#b38454"
        />
      </Float>

      <ambientLight intensity={0.28} />
    </>
  );
}
