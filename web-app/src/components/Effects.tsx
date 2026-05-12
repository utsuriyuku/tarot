import { Stars, Sparkles, Float } from '@react-three/drei';

export default function Effects() {
  return (
    <>
      {/* 极简深色背景与景深雾效 */}
      <color attach="background" args={['#020208']} />
      <fog attach="fog" args={['#020208', 5, 20]} />
      
      {/* 网格星空背景 */}
      <Stars 
        radius={10} 
        depth={50} 
        count={5000} 
        factor={3} 
        saturation={0} 
        fade 
        speed={1} 
      />
      
      {/* 悬浮光团/粒子 */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sparkles 
          count={100} 
          scale={10} 
          size={3} 
          speed={0.4} 
          opacity={0.4} 
          color="#88ccff" 
        />
      </Float>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1}>
        <Sparkles 
          count={50} 
          scale={8} 
          size={5} 
          speed={0.2} 
          opacity={0.2} 
          color="#aa88ff" 
        />
      </Float>
      
      {/* 基础光照环境 */}
      <ambientLight intensity={0.2} />
    </>
  );
}
