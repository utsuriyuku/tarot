import { Stars, Sparkles, Float } from '@react-three/drei';

export default function Effects() {
  return (
    <>
      <color attach="background" args={['#04060d']} />
      <fog attach="fog" args={['#04060d', 8, 24]} />

      <Stars
        radius={18}
        depth={90}
        count={2600}
        factor={4}
        saturation={0}
        fade
        speed={0.8}
      />

      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sparkles
          count={70}
          scale={12}
          size={2.6}
          speed={0.35}
          opacity={0.35}
          color="#9fd8ff"
        />
      </Float>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1}>
        <Sparkles
          count={36}
          scale={9}
          size={4}
          speed={0.18}
          opacity={0.16}
          color="#9f8bff"
        />
      </Float>

      <ambientLight intensity={0.28} />
    </>
  );
}
