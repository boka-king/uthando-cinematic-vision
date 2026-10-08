import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useRef } from "react";
import { Group } from "three";

type Palette = { surface: string; light: string; accent: string };

function Veils({ palette }: { palette: Palette }) {
  const group = useRef<Group>(null);
  const time = useRef(0);
  useFrame(({ pointer }, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    time.current += dt;
    if (!group.current) return;
    const ease = 1 - Math.exp(-1.2 * dt);
    group.current.rotation.y += (pointer.x * 0.07 - group.current.rotation.y) * ease;
    group.current.rotation.x += (pointer.y * -0.04 - group.current.rotation.x) * ease;
    group.current.position.y = Math.sin(time.current * 0.12) * 0.08;
  });
  return (
    <group ref={group} rotation-z={-0.3}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, -1.9 - i * 0.35, -2 - i]} rotation={[0.9, 0.12 * i, 0]}>
          <torusGeometry args={[5 + i * 1.4, 0.06 + i * 0.025, 8, 100, Math.PI * 1.2]} />
          <meshStandardMaterial color={i === 1 ? palette.accent : palette.surface} metalness={0.6} roughness={0.38 + i * 0.13} />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroDepth() {
  // This module is imported only after hydration, on eligible desktop views.
  const css = getComputedStyle(document.documentElement);
  const sample = document.createElement("canvas");
  sample.width = sample.height = 1;
  const context = sample.getContext("2d");
  if (!context) return null;
  const token = (name: string) => {
    context.clearRect(0, 0, 1, 1);
    context.fillStyle = css.getPropertyValue(name).trim();
    context.fillRect(0, 0, 1, 1);
    const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
    return `rgb(${r},${g},${b})`;
  };
  const palette = { surface: token("--secondary"), light: token("--foreground"), accent: token("--primary") };
  return (
    <Canvas dpr={1} camera={{ position: [0, 0, 9], fov: 45 }} gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}>
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} color={palette.light} />
      <Environment resolution={64}>
        <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 3, 1]} color={palette.light} />
        <Lightformer intensity={1} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} color={palette.accent} />
      </Environment>
      <Veils palette={palette} />
    </Canvas>
  );
}